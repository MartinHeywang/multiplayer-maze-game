import React, { FC, useContext, useEffect, useRef, useState } from "react";

import { Cell, Coord, Game, Labyrinth } from "otd-types";
import { useServerConnection } from "./ServerConnectionContext";
import { usePlayer } from "./PlayerContext";
import { useNavigate } from "react-router-dom";

type ContextValue = {
    game: Game | null;
    cells: (Cell | null)[][] | null;
    playerPos: Coord | null;
    dimensions: Labyrinth["dimensions"] | null;
    catchNextGameError: (cb: (err: string) => void) => void;
};

// @ts-ignore
// stupid context default values
// explained in ServerConnectionContext, same place
const GameContext = React.createContext<ContextValue>(null);
const { Provider, Consumer } = GameContext;

const GameProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { socket } = useServerConnection();
    const { player } = usePlayer();

    const [game, setGame] = useState<Game | null>(null);
    const [cells, setCells] = useState<(Cell | null)[][] | null>(null);
    const [playerPos, setPlayerPos] = useState<Coord | null>(null);
    const [dimensions, setDimensions] = useState<Labyrinth["dimensions"] | null>(null);

    const navigate = useNavigate();

    const errorCallbacks = useRef<((err: string) => void)[]>([]);

    // update state on "game:update"
    useEffect(() => {
        if (!socket) return;

        const handler = (game: Game | null) => {
            const newGame: Game | null = game && {
                ...game,

                // some weird adjustments needs to be made
                // the serialization performed by socket.io transforms date into string,
                // but then not a date again
                // so we're parsing it here
                plannedStartTime: new Date(Date.parse(game.plannedStartTime as unknown as string)),
            };

            setGame(newGame);
            errorCallbacks.current.splice(0);
        };

        socket.on("game:update", handler);

        socket.emit("game:request-update");
        socket.emit("game:watch", true);

        return () => {
            socket.emit("game:watch", false);
            socket.off("game:update", handler);
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;
        if (player?.hasJoinedNextGame !== true) return;

        const handler = (dimensions: Labyrinth["dimensions"], cells: Cell[][], playerPos: Coord) => {
            setDimensions(dimensions);

            setCells(old =>
                (() => {
                    let result: (Cell | null)[][] = old ?? [];

                    cells.flat().forEach(cell => {
                        result[cell.coord.y] ||= [];
                        result[cell.coord.y][cell.coord.x] = cell;
                    });

                    return result;
                })()
            );

            setPlayerPos(playerPos);

            navigate("/play");
        };

        socket.on("game:player-change", handler);

        return () => {
            socket.off("game:player-change", handler);
        };
    }, [player?.hasJoinedNextGame]);

    function catchNextGameError(cb: (msg: string) => void) {
        if (!socket) return;

        socket.once("game:error", cb);
        errorCallbacks.current.push(cb);
    }

    return <Provider value={{ game, cells, playerPos, dimensions, catchNextGameError }}>{children}</Provider>;
};

export const useGame = () => useContext(GameContext);

export { GameContext, GameProvider, Consumer as GameConsumer };
