import { OurSocket, Game } from "otd-types";
import { playerId } from "./player";

import * as nextGame from "../model/nextGame";
import * as playingGame from "../model/playingGame";

import { NextGame } from "../model/nextGame";
import { PlayingGame } from "../model/playingGame";
import { io } from "..";

export const getGameRoomName = (game: Game, suffix: string) => `game#${game.id}:${suffix}`;

let areEventsActivated = false;
export const enable = () => (areEventsActivated = true);
export const disable = () => (areEventsActivated = false);

export function registerSocket(socket: OurSocket) {
    socket.on("game:request-update", requestUpdate);

    socket.on("game:join", join);

    const update = (game: Partial<Game & { joined: boolean }>) => socket.emit("game:update", game);
    const error = (msg: string) => socket.emit("game:error", msg);
    const caught = (cb: () => Partial<Game & { joined: boolean }>) => {
        try {
            const returned = cb();
            update(returned);
        } catch (msg) {
            error(msg as string);
        }
    };

    function requestUpdate() {
        socket.emit("game:update", nextGame.get());
    }

    function join() {
        if(!areEventsActivated) return;

        caught(() => {
            const game = nextGame.join(playerId(socket)!);
            socket.join(getGameRoomName(game, "players"));

            socket.on("disconnect", () => {
                nextGame.leave(game.id, playerId(socket)!);
                socket.leave(getGameRoomName(game, "players"));

                update({ joined: false });
            });

            return { joined: true };
        });
    }
}

export function notifyGameStatusChange(status: Game["status"] | NextGame["status"] | PlayingGame["status"]) {
    const currentGame = nextGame.get() ?? playingGame.get();
    if (currentGame === null || currentGame.status !== status) return;

    io.emit("game:update", { status });
}

/*

"game:player-move": (direction: "up" | "left" | "right" | "down") => void;

in the future, we will change this to
game:cells (without giving the playerPos)
and game:players (giving the position of all players)

"game:player-change": (
    dimensions: Labyrinth["dimensions"],
    updatedCells: Cell[][],
    playerPos: Coord
) => void;

"game:winner": (player: Omit<Player, "hasJoinedNextGame">) => void;

*/
