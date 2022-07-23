import React, { FC, useEffect, useRef } from "react";
import { useGame } from "@/contexts/GameContext";

import Cell from "./Cell";

import "./scss/Play.scss";
import { useServerConnection } from "@/contexts/ServerConnectionContext";
import { useNavigate } from "react-router-dom";

const Play: FC = () => {
    const { socket } = useServerConnection();
    const { cells, playerPos, dimensions, winner } = useGame();

    const board = useRef<HTMLDivElement>(null);
    const componentRoot = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!cells) return;
        if (!dimensions) return;
        if (!playerPos) return;

        board.current!.style.setProperty("--cells-count", `${dimensions.w}`);
        componentRoot.current!.style.setProperty("--player-x", `${playerPos.x}`);
        componentRoot.current!.style.setProperty("--player-y", `${playerPos.y}`);
    }, [cells, playerPos, dimensions]);

    useEffect(() => {
        if(!winner) return;

        navigate("/game-end");
    }, [winner])

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (/^Arrow.+$/g.test(event.key)) {
                const direction = event.key.toLowerCase().substring(5) as
                    | "up"
                    | "left"
                    | "right"
                    | "down";
                socket?.emit("game:player-move", direction);
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    return (
        <div className="Play" ref={componentRoot}>
            <div className="board-frame">
                <div className="board" ref={board}>
                    {cells?.flat().map(cell => {
                        return <Cell cell={cell} key={`${cell?.coord.x}.${cell?.coord.y}`} />;
                    })}

                    <div className="player"></div>
                </div>
            </div>
        </div>
    );
};

export default Play;
