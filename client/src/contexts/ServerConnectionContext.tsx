import React, { FC, useContext, useEffect, useState } from "react";

import { OurClientSocket } from "otd-types";

import { io } from "socket.io-client";

import ip from "ip";

import serverConfig from "@/data/serverConfig";

type ContextValue = {
    socket: OurClientSocket | null;
    connect?: (ip?: string) => Promise<OurClientSocket>;
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

    function connect(ipPlusPort?: string) {
        return new Promise<OurClientSocket>((resolve, reject) => {
            if (isSocketUsable()) reject(new Error("Une autre connexion est active en ce moment."));

            const rejectError = (msg: string) => reject(new Error(msg));
            const invalidFormatMsg = "Format d'IP invalide.";

            let url = "https://multiplayer-maze-game.herokuapp.com";

            if (ipPlusPort !== undefined) {
                const [ipAddress, port] = ipPlusPort.split(":");

                if (!ip.isV4Format(ipAddress)) {
                    return rejectError(invalidFormatMsg);
                }

                if (!ip.isPrivate(ipAddress)) {
                    return rejectError("Cette IP ne désigne pas un réseau privé.");
                }

                const portNumber = parseInt(port);
                if (portNumber === NaN) return rejectError("Veuillez également renseigner un port.");
                if (portNumber > 65535) return rejectError(invalidFormatMsg);

                url = `http://${ipAddress}:${port}`;
            }

            const socket = io(url, {
                reconnectionAttempts: 3,
            });

            let invalid = false;
            // function that returns true the first time, then false forever
            const invalidate = () => {
                if (invalid) return false;
                invalid = !invalid;
                return invalid;
            };

            socket.once("connect", () => {
                if (!invalidate()) return;

                setSocket(socket);
                resolve(socket);
            });

            socket.once("connect_error", error => {
                if (!invalidate()) return;

                const errorMap = {
                    "xhr poll error": `Serveur indisponible${ip !== undefined ? " ou IP incorrecte" : ""}.`,
                };

                // convert socket.io message to user-friendly message
                reject(new Error(errorMap[error.message as keyof typeof errorMap] ?? "Erreur interne."));
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
