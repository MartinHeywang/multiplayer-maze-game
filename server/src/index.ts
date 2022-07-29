import { Server } from "socket.io";
import { createServer } from "http";
import { OurServer } from "otd-types";
import ip from "ip";

import * as playerEvents from "./events/player";
import * as gameEvents from "./events/game";
import * as playEvents from "./events/play";

import * as games from "./model/games";

import { handleGameWhenAvailable } from "./model/nextGame";

const httpServer = createServer((req, res) => {
    res.write("OK!");
    res.statusCode = 200;
    res.end();
});

export const io: OurServer = new Server(httpServer, {
    cors: {},
});

const HOSTNAME = ip.address();
const PORT = process.env.PORT ?? 5000;

io.on("connection", socket => {
    console.log(`Socket ${socket.id} has just connected to the server!`);

    playerEvents.registerSocket(socket);
    gameEvents.registerSocket(socket);
    playEvents.registerSocket(socket);

    socket.on("disconnect", reason => {
        console.log(`Socket ${socket.id} got disconnected. (reason: ${reason})`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Ready on http://${HOSTNAME}:${PORT}`);

    // schedule games
    if (process.env.NODE_ENV === "development") {
        // in dev, schedule a game after server restarts
        games.schedule(new Date().getUTCHours(), new Date().getUTCMinutes() + 2);
    } else {
        // remember: it's UTC ! (West-Europe: add 2 hours)
        games.schedule(6, 5);
        games.schedule(7, 15);
        games.schedule(8, 30);
        games.schedule(10, 0);
        games.schedule(11, 45);
        games.schedule(13, 45);
        games.schedule(15, 0);
    }

    handleGameWhenAvailable();
});
