import React, { FC, useContext, useEffect, useRef, useState } from "react";

import { Player } from "otd-types";
import { useServerConnection } from "./ServerConnectionContext";

type ContextValue = { player: Player | null; catchNextPlayerError: (cb: (err: string) => void) => void };

// @ts-ignore
// stupid context default values
// explained in ServerConnectionContext, same place
const PlayerContext = React.createContext<ContextValue>(null);
const { Provider, Consumer } = PlayerContext;

const PlayerProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { socket } = useServerConnection();
    const [player, setPlayer] = useState<Player | null>(null);

    const errorCallbacks = useRef<((err: string) => void)[]>([]);

    // update state on "player:update"
    useEffect(() => {
        if (!socket) return;

        const handler = (player: Player) => {
            setPlayer(player);
            errorCallbacks.current.splice(0);
        };

        socket.on("player:update", handler);

        socket.emit("player:request-update");

        return () => {
            socket.off("player:update", handler);
        };
    }, [socket]);

    function catchNextPlayerError(cb: (msg: string) => void) {
        if (!socket) return;

        socket.once("player:error", cb);
        errorCallbacks.current.push(cb);
    }

    return <Provider value={{ player, catchNextPlayerError }}>{children}</Provider>;
};

export const usePlayer = () => useContext(PlayerContext);

export { PlayerContext, PlayerProvider, Consumer as PlayerConsumer };
