import React, { FC, useContext, useEffect, useRef, useState } from "react";

import { Game } from "otd-types";
import { useServerConnection } from "./ServerConnectionContext";
import { usePlayer } from "./PlayerContext";

type ContextValue = { game: Game | null; catchNextGameError: (cb: (err: string) => void) => void };

// @ts-ignore
// stupid context default values
// explained in ServerConnectionContext, same place
const GameContext = React.createContext<ContextValue>(null);
const { Provider, Consumer } = GameContext;

const GameProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { socket } = useServerConnection();
    const [game, setGame] = useState<Game | null>(null);

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

            console.log("game:update");
            console.log(game?.plannedStartTime);
            console.log(newGame);

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

    function catchNextGameError(cb: (msg: string) => void) {
        if (!socket) return;

        socket.once("game:error", cb);
        errorCallbacks.current.push(cb);
    }

    return <Provider value={{ game, catchNextGameError }}>{children}</Provider>;
};

export const useGame = () => useContext(GameContext);

export { GameContext, GameProvider, Consumer as GameConsumer };
