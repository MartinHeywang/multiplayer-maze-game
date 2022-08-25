import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "@/contexts/GameContext";

import CellComp from "./Cell";

import "./scss/Play.scss";
import { useServerConnection } from "@/contexts/ServerConnectionContext";
import { useNavigate } from "react-router-dom";
import { Cell, Coord, Player } from "otd-types";
import { usePlayer } from "@/contexts/PlayerContext";

const Play: FC = () => {
    const { socket } = useServerConnection();
    const { player: ourPlayer } = usePlayer();

    const [cells, setCells] = useState<Cell[][]>();
    const dimensions = useMemo(() => {
        if (cells === undefined) return undefined;

        // these valus are only valid if the board is a rectangle
        const h = cells.length;
        const w = cells.reduce((sub, row) => (row ? Math.max(sub, row.length) : sub), 0);

        console.log({ w, h });
        return { w, h };
    }, [JSON.stringify(cells)]);

    const [players, setPlayers] = useState<(Player & { position: Coord })[]>();
    const ourPosition = useMemo(() => {
        if (players === undefined) return undefined;

        return players.find(player => player.id === ourPlayer?.id)!.position;
    }, [players]);

    useEffect(() => {
        if (!socket) return;

        const handler = (cells: Cell[]) => {
            console.log("play:cells");

            setCells(old => {
                const result: Cell[][] = [];

                (old ?? []).flat().concat(cells).forEach(cell => {
                    result[cell.coord.y] ||= [];
                    result[cell.coord.y][cell.coord.x] = cell;
                });

                return result;
            });
        };

        socket.on("play:cells", handler);

        return () => {
            socket.off("play:cells", handler);
        };
    });

    useEffect(() => {
        if (!socket) return;

        const handler = (...players: (Player & { position: Coord })[]) => {
            function findRight<T>(x: T[], ft: (el: T, idx: number, arr: T[]) => boolean): T | undefined {
                for (var i = x.length - 1; i >= 0; i--) if (ft(x[i], i, x)) return x[i];
                return undefined;
            }

            setPlayers(old => {
                const allPlayers = [...(old ?? []), ...players]; // may contain duplicate ids
                const allIds = new Set(allPlayers.map(player => player.id)); // w/o duplicates

                return Array.from(
                    allIds,
                    playerId => findRight(allPlayers, player => player.id === playerId)!
                );
            });
        };

        socket.on("play:players", handler);

        return () => {
            socket.off("play:players", handler);
        };
    });

    const board = useRef<HTMLDivElement>(null);
    const componentRoot = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!dimensions) return;
        if (!ourPosition) return;

        board.current!.style.setProperty("--cells-w", `${dimensions.w}`);
        board.current!.style.setProperty("--cells-h", `${dimensions.h}`);
        componentRoot.current!.style.setProperty("--player-x", `${ourPosition.x}`);
        componentRoot.current!.style.setProperty("--player-y", `${ourPosition.y}`);
    }, [ourPosition, dimensions]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (/^Arrow.+$/g.test(event.key)) {
                const direction = event.key.toLowerCase().substring(5) as
                    | "up"
                    | "left"
                    | "right"
                    | "down";
                console.log(`move ${direction}`);
                socket?.emit("play:move", direction);
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
                        return <CellComp cell={cell} key={`${cell?.coord.x}.${cell?.coord.y}`} />;
                    })}

                    {players?.map(player => {
                        return (
                            <div
                                key={player.id}
                                className={`player ${player.id === ourPlayer?.id ? "our-player" : ""}`}
                                style={{
                                    transform: `translate(
                                        calc(${player.position.x} * (var(--cell-size) + var(--board-grid-gap))),
                                        calc(${player.position.y} * (var(--cell-size) + var(--board-grid-gap)))
                                    )`,
                                }}
                            ></div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Play;
