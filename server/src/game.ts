import { OurServer, OurSocket } from "otd-types";
import { Game as GameBase } from "otd-types";
import { io } from ".";

import * as player from "./player";

type Game = GameBase & { sockets: Set<OurSocket> };

let scheduledGames: Game[] = [];
let nextGame: Game | null = null;

function initiateNewGame() {
    const oldGame = nextGame;

    nextGame = scheduledGames[0] ?? null;
    if (!nextGame) return;

    scheduledGames.splice(0, 1); // remove the next game from the planned one

    oldGame?.sockets.forEach(socket => {
        player.editSocketData(socket, { hasJoinedNextGame: false });
    });

    setTimeout(() => {
        editGameWithNotify(io, { status: "opened" });
    }, nextGame.plannedStartTime.getTime() - 1000 * 60 * 5 - Date.now()); // five minutes before the game starts

    setTimeout(() => {
        editGameWithNotify(io, { status: "playing" });
    }, nextGame.plannedStartTime.getTime() - Date.now()); // when the game starts
}

export function registerSocket(_: OurServer, socket: OurSocket) {
    socket.on("game:join", () => join(socket));
    socket.on("game:request-update", () => emitUpdate(socket));
    socket.on("game:watch", toggle => watch(socket, toggle));

    player.editSocketData(socket, { hasJoinedNextGame: false });
}

function editGameWithNotify(io: OurServer, game: Partial<Game>) {
    nextGame = {
        ...nextGame!,
        ...game,
    };

    io.to("game:watching").emit("game:update", nextGame);
}

function emitUpdate(socket: OurSocket) {
    socket.emit("game:update", nextGame);
}

function emitError(socket: OurSocket, message: string) {
    socket.emit("game:error", message);
}

function watch(socket: OurSocket, watch = true) {
    if (watch) return socket.join("game:watching");
    socket.leave("game:watching");
}

function join(socket: OurSocket) {
    if (!nextGame) return;

    nextGame.sockets.add(socket);

    player.editSocketData(socket, { hasJoinedNextGame: true });
}

// plan all games for the day
{
    function schedule(hour: number, minute: number) {
        const time = 1000 * 60 * 60 * hour + 1000 * 60 * minute;

        const now = new Date(); // UTC now

        const lastMidnight = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()); // UTC midnight

        const plannedStartTime = new Date(lastMidnight + time);

        const game: Game = {
            plannedStartTime,
            sockets: new Set(),
            status: "closed",
        };

        scheduledGames.push(game);
        scheduledGames.sort((a, b) => {
            if (a.plannedStartTime.getTime() < b.plannedStartTime.getTime()) return -1;
            if (b.plannedStartTime.getTime() < a.plannedStartTime.getTime()) return 1;
            return 0;
        });
    }

    schedule(6, 22);

    initiateNewGame();
}