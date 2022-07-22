import React, { FC, useEffect, useRef } from "react";
import { useGame } from "@/contexts/GameContext";

import "./scss/Play.scss";
import Cell from "./Cell";

const Play: FC = () => {

    const { game, cells } = useGame();

    const board = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!cells) return;

        const size = cells.length;

        board.current!.style.setProperty("--cells-count", `${size}`);
    }, [cells]);

    return <div className="Play">
        <div className="board-frame">
            <div className="board" ref={board}>
                {cells?.flat().map(cell => {
                    return <Cell cell={cell} key={`${cell?.coord.x}.${cell?.coord.y}`} />
                })}
            </div>
        </div>
    </div>;
};

export default Play;
