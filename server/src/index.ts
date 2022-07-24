import { Server } from "socket.io";
import { createServer } from "http";
import { OurServer } from "otd-types";
import ip from "ip";

import * as player from "./player";
import * as game from "./game";
import { loadRandomLabyrinth } from "./labyrinths/loader";

const httpServer = createServer();
export const io: OurServer = new Server(httpServer, {
    cors: {},
});

const HOSTNAME = ip.address();
const PORT = process.env.PORT ?? 5000;

io.on("connection", socket => {
    console.log(`Socket ${socket.id} has just connected to the server!`);

    player.registerSocket(io, socket);
    game.registerSocket(io, socket);

    socket.on("disconnect", reason => {
        console.log(`Socket ${socket.id} got disconnected. (reason: ${reason})`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Ready on http://${HOSTNAME}:${PORT}`);
});
