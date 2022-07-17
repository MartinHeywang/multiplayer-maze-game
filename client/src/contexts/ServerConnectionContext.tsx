import React, { FC, useContext, useState } from "react";

import { OurClientSocket } from "otd-types";

import { io } from "socket.io-client";

type ContextValue = {
    socket: null,
    connect: (uri: string) => void
} | {
    socket: OurClientSocket,
    disconnect: () => void
};

function errorFn() {
    throw new Error("ServerConnectionContext is not provided here!");
}

const ServerConnectionContext = React.createContext<ContextValue>({ socket: null, connect: errorFn });
const { Provider, Consumer } = ServerConnectionContext;

const ServerConnectionProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<OurClientSocket | null>(null);

    function connect(uri: string) {
        const socket = io(uri).connect();
        setSocket(socket);
    }

    function disconnect() {
        if (!socket) return;

        socket?.disconnect();
        setSocket(null);
    }

    return (
        <Provider
            value={(() => {
                const isSocketUsable = socket !== null && socket.connected;
                return isSocketUsable? { socket, disconnect } : { socket: null, connect };
            })()}
        >
            {children}
        </Provider>
    );
};

export const useServerConnection = useContext(ServerConnectionContext);

export { ServerConnectionContext, ServerConnectionProvider, Consumer as ServerConnectionConsumer };
