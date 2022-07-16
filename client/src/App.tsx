import React, { FC } from "react";

import HomePage from "./pages/Home";

import "./App.scss";
import { Route, Routes } from "react-router-dom";

const App: FC<{}> = () => {
    return (
        <div className="App">
            <Routes>
                <Route index element={<HomePage />} />
            </Routes>
        </div>
    );
};

export default App;
