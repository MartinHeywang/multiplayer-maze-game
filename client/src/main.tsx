import React, { FC } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App";

import "normalize.css";
import "./assets/scss/index.scss";
import { ServerConnectionProvider } from "./contexts/ServerConnectionContext";

const GlobalContexts: FC<{ children: React.ReactNode }> = ({ children }) => {
    return <ServerConnectionProvider>{children}</ServerConnectionProvider>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GlobalContexts>
            <HashRouter>
                <App />
            </HashRouter>
        </GlobalContexts>
    </React.StrictMode>
);
