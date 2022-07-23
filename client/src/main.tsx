import React, { FC } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App";
import { ServerConnectionProvider } from "./contexts/ServerConnectionContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import { GameProvider } from "./contexts/GameContext";

import "normalize.css";
import "./assets/scss/index.scss";
import { ServerConnectionProvider } from "./contexts/ServerConnectionContext";
import { PlayerProvider } from "./contexts/PlayerContext";

const GlobalContexts: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ServerConnectionProvider>
            <PlayerProvider>{children}</PlayerProvider>
        </ServerConnectionProvider>
    );
};

const GlobalContexts: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ServerConnectionProvider>
            <PlayerProvider>
                <GameProvider>{children}</GameProvider>
            </PlayerProvider>
        </ServerConnectionProvider>
    );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <HashRouter>
            <GlobalContexts>
                <App />
            </GlobalContexts>
        </HashRouter>
    </React.StrictMode>
);
