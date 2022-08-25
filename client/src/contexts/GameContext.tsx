import React, { FC, useContext, useEffect, useRef, useState } from "react";

import { Cell, Coord, Game, Labyrinth, Player } from "otd-types";
import { useServerConnection } from "./ServerConnectionContext";
import { usePlayer } from "./PlayerContext";
import { useNavigate } from "react-router-dom";

type ContextValue = {
    game: (Game & { joined?: boolean }) | null;

    winner: Omit<Player, "hasJoinedNextGame"> | null;
    catchNextGameError: (cb: (err: string) => void) => void;
};

// @ts-ignore
// stupid context default values
// explained in ServerConnectionContext, same place
const GameContext = React.createContext<ContextValue>(null);
const { Provider, Consumer } = GameContext;

const GameProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { socket } = useServerConnection();

    const [game, setGame] = useState<ContextValue["game"]>(null);
    const [winner, setWinner] = useState<ContextValue["winner"]>(null);

    const navigate = useNavigate();

    const errorCallbacks = useRef<((err: string) => void)[]>([]);

    // update state on "game:update"
    useEffect(() => {
        if (!socket) return;

        const handler = (updatedGame: Partial<Game & { joined: boolean }> | null) => {
            // @ts-expect-error
            // updatedGame and game are both Partial<>
            // but we know that at least once we will receive this event with all the properties set
            // which means the game state will always be in a correct state
            setGame(old => {
                if (updatedGame !== null && typeof updatedGame.startTime === "string") {
                    updatedGame.startTime = new Date(updatedGame.startTime);
                }

                const value = {
                    ...old,
                    ...updatedGame,
                    startTime: updatedGame?.startTime
                        ? new Date(updatedGame.startTime!)
                        : old?.startTime,
                };

                return value;
            });
            errorCallbacks.current.splice(0);
        };

        socket.on("game:update", handler);
        socket.emit("game:request-update");

        return () => {
            socket.off("game:update", handler);
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;
        if (game?.joined !== true) return;

        const handler = () => {
            navigate("/play");

            socket.once("play:end", winner => {
                setWinner(winner);
                navigate("/game-end");
            });
        };

        socket.on("play:start", handler);

        return () => {
            socket.off("play:start", handler);
        };
    }, [game?.joined]);

    function catchNextGameError(cb: (msg: string) => void) {
        if (!socket) return;

        socket.once("game:error", cb);
        errorCallbacks.current.push(cb);
    }

    return <Provider value={{ game, winner, catchNextGameError }}>{children}</Provider>;
};

export const useGame = () => useContext(GameContext);

export { GameContext, GameProvider, Consumer as GameConsumer };
