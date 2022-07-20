import { OurServer, OurSocket } from "otd-types";
import { Game as GameBase } from "otd-types";

import * as player from "./player";

type Game = GameBase & { sockets: Set<OurSocket> };

let nextGame: Game = {
    plannedStartTime: new Date(),
    sockets: new Set<OurSocket>(),
    status: "closed",
};

export function registerSocket(_: OurServer, socket: OurSocket) {
    socket.on("game:join", () => join(socket));
    socket.on("game:request-update", () => emitUpdate(socket));
    socket.on("game:watch", toggle => watch(socket, toggle));

    player.editSocketData(socket, { hasJoinedNextGame: false });
}

function emitUpdate(socket: OurSocket) {
    socket.emit("game:update", nextGame);
}

function emitError(socket: OurSocket, message: string) {
    socket.emit("game:error", message);
}

function watch(socket: OurSocket, watch = true) {
    (watch ? socket.join : socket.leave)("game:watching");
}

function join(socket: OurSocket) {
    nextGame.sockets.add(socket);

    player.editSocketData(socket, { hasJoinedNextGame: true });
}
