import React, { FC, useContext, useEffect, useState } from "react";

import { OurClientSocket } from "otd-types";

import { io } from "socket.io-client";

type ContextValue = {
    socket: OurClientSocket | null;
    connect?: (uri: string) => Promise<OurClientSocket>;
    disconnect?: () => void;
};

// @ts-ignore
// providing a default value for the state is really useless (because this context is provided everywhere in the app!)
// and I prefer to put null here as the default value
// but of course this causes a type error
const ServerConnectionContext = React.createContext<ContextValue>(null);
const { Provider, Consumer } = ServerConnectionContext;

const ServerConnectionProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<OurClientSocket | null>(null);

    const isSocketUsable = () => socket !== null && socket.connected;

    function connect(uri: string) {
        if (isSocketUsable()) {
            throw new Error(
                "Impossible de se connecter, car une autre connexion est active en ce moment."
            );
        }

        return new Promise<OurClientSocket>((resolve, reject) => {
            const socket = io(uri);

            let invalid = false;
            // function that returns true the first time, then false forever
            const invalidate = () => {
                if (invalid) return false;
                invalid = !invalid;
                return invalid;
            };

            // perhaps we will add a timeout here, but we'll keep it simple right now

            socket.once("connect", () => {
                if (!invalidate()) return;

                resolve(socket);
            });

            socket.once("connect_error", error => {
                if (!invalidate()) return;

                reject(error);
            });

            socket.connect();
        });
    }

    function disconnect() {
        if (!socket) return;

        socket.disconnect();
        setSocket(null);
    }

    useEffect(() => {
        if (!socket) return;

        const handle = () => setSocket(null);

        socket.on("disconnect", handle);

        return () => {
            socket.off("disconnect", handle);
        };
    }, [socket]);

    return (
        <Provider
            value={(() => (isSocketUsable() ? { socket, disconnect } : { socket: null, connect }))()}
        >
            {children}
        </Provider>
    );
};

export const useServerConnection = () => useContext(ServerConnectionContext);

export { ServerConnectionContext, ServerConnectionProvider, Consumer as ServerConnectionConsumer };
