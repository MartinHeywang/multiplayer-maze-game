import { Cell, Coord, Labyrinth, OurServer, OurSocket } from "otd-types";
import { Game as GameBase } from "otd-types";
import { io } from ".";
import { loadRandomLabyrinth } from "./labyrinths/loader";

import * as player from "./player";

type Game = GameBase & { sockets: Set<OurSocket>; labyrinth: Labyrinth };

let scheduledGames: Game[] = [];
let nextGame: Game | null = null;

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

    emitUpdate();
}

function emitUpdate(socket?: OurSocket) {
    // emit to socket if provided, otherwise to all watching sockets
    // + only provide the client version of games
    (socket ?? io.to("game:watching")).emit("game:update", {
        ...nextGame,
        sockets: undefined,
        labyrinth: undefined,
    } as GameBase);
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
    socket.on("disconnect", () => nextGame!.sockets.delete(socket));

    socket.join("game:next-game");

    player.editSocketData(socket, { hasJoinedNextGame: true });
}

function getCellsAround(coord: Coord) {
    const labyrinth = nextGame!.labyrinth;
    const minX = Math.max(coord.x - 2, 0);
    const minY = Math.max(coord.y - 2, 0);
    const maxX = Math.min(minX + 4, labyrinth.dimensions.w - 1);
    const maxY = Math.min(minY + 4, labyrinth.dimensions.h - 1);

    let cells: Cell[][] = [];
    let resultX = 0;
    let resultY = 0;
    for (let y = minY; y <= maxY; y++) {
        cells[resultY] = [];
        for (let x = minX; x <= maxX; x++) {
            cells[resultY][resultX] = labyrinth.cells[y][x];
            resultX++;
        }
        resultX = 0;
        resultY++;
    }
    return cells;
}

function initiateNewGame() {
    const oldGame = nextGame;

    nextGame = scheduledGames[0] ?? null;
    if (!nextGame) return;

    scheduledGames.splice(0, 1); // remove the next game from the planned one

    oldGame?.sockets.forEach(socket => {
        player.editSocketData(socket, { hasJoinedNextGame: false });
    });

    const fiveMinutesBeforeGameStart = nextGame.plannedStartTime.getTime() - 1000 * 60 * 5 - Date.now();
    const atGameStart = nextGame.plannedStartTime.getTime() - Date.now();

    setTimeout(openInscription, fiveMinutesBeforeGameStart);
    setTimeout(startGame, atGameStart);
}

function openInscription() {
    editGameWithNotify(io, { status: "opened" });
}

function startGame() {
    editGameWithNotify(io, { status: "playing" });

    io.in("game:next-game")
        .allSockets()
        .then(socketsId => {
            socketsId.forEach(socketId => {
                const socket = io.sockets.sockets.get(socketId)!;

                socket.on("game:player-move", direction => move(socket, direction));

                socket.data.game = { playerCoord: nextGame!.labyrinth.startCoord };
            });
        });

    io.to("game:next-game").emit(
        "game:player-change",
        nextGame!.labyrinth.dimensions,
        getCellsAround(nextGame!.labyrinth.startCoord),
        nextGame!.labyrinth.startCoord
    );
}

function move(socket: OurSocket, direction: "up" | "left" | "right" | "down") {
    const oldCoord = socket.data.game!.playerCoord;

    const isMoveImpossible = () => {
        try {
            if (direction === "up")
                return nextGame!.labyrinth.cells[oldCoord.y - 1][oldCoord.x].bottomWall;
            if (direction === "left")
                return nextGame!.labyrinth.cells[oldCoord.y][oldCoord.x - 1].rightWall;
            if (direction === "right")
                return nextGame!.labyrinth.cells[oldCoord.y][oldCoord.x].rightWall;
            if (direction === "down")
                return nextGame!.labyrinth.cells[oldCoord.y][oldCoord.x].bottomWall;
        } catch {
            // index out of bound error
            // e.g if you try to go up but you're already at the top of the labyrinth
            // -> impossible move
            return true;
        }
    };

    if (isMoveImpossible()) return;

    const inBoundaries = (coord: Coord) => {
        const minX = 0;
        const minY = 0;
        const maxX = nextGame!.labyrinth.cells[0].length - 1;
        const maxY = nextGame!.labyrinth.cells.length - 1;

        return {
            x: Math.min(Math.max(coord.x, minX), maxX),
            y: Math.min(Math.max(coord.y, minY), maxY),
        };
    };

    const newCoord = inBoundaries(
        (() => {
            switch (direction) {
                case "up":
                    return { x: oldCoord.x, y: oldCoord.y - 1 };
                case "left":
                    return { x: oldCoord.x - 1, y: oldCoord.y };
                case "right":
                    return { x: oldCoord.x + 1, y: oldCoord.y };
                case "down":
                    return { x: oldCoord.x, y: oldCoord.y + 1 };
            }
        })()
    );

    socket.data.game!.playerCoord = newCoord;

    socket.emit(
        "game:player-change",
        nextGame!.labyrinth.dimensions,
        getCellsAround(newCoord),
        newCoord
    );
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
            labyrinth: loadRandomLabyrinth(),
        };

        scheduledGames.push(game);
        scheduledGames.sort((a, b) => {
            if (a.plannedStartTime.getTime() < b.plannedStartTime.getTime()) return -1;
            if (b.plannedStartTime.getTime() < a.plannedStartTime.getTime()) return 1;
            return 0;
        });
    }

    schedule(8, 3);

    initiateNewGame();
}
