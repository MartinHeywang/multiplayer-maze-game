import { useGame } from "@/contexts/GameContext";
import React, { FC } from "react";

const Play: FC = () => {

    const { game, cells } = useGame();

    return <div>{JSON.stringify(game)}<br/><br/>{JSON.stringify(cells)}</div>;
};

export default Play;
