import React, { FC } from "react";

import HomePage from "@/pages/Home";
import LoadingPage from "@/pages/Loading";
import SetupPage from "@/pages/Setup";

import RoomPage from "@/pages/Room";
import PlayPage from "@/pages/Play";
import GameEndPage from "@/pages/GameEnd";

import "@/App.scss";
import { Route, Routes } from "react-router-dom";

const App: FC<{}> = () => {
    return (
        <div className="App">
            <Routes>
                <Route index element={<HomePage />} />
                <Route path="setup" element={<SetupPage />} />
                <Route path="loading" element={<LoadingPage />} />
                <Route path="room" element={<RoomPage />} />
                <Route path="play" element={<PlayPage />} />
                <Route path="game-end" element={<GameEndPage />} />
            </Routes>
        </div>
    );
};

export default App;
