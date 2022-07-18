import { Server } from "socket.io";
import { createServer } from "http";
import ip from "ip";

import { OurServer } from "otd-types";

const httpServer = createServer();
const io: OurServer = new Server(httpServer, {
    cors: {}
});

const HOSTNAME = ip.address();
const PORT = 5000;

io.on("connection", socket => {
    console.log(`Socket ${socket.id} has just connected to the server!`);

    socket.on("disconnect", reason => {
        console.log(`Socket ${socket.id} got disconnected. (reason: ${reason})`);
    });
});

httpServer.listen(PORT, HOSTNAME, () => {
    console.log(`Ready on http://${HOSTNAME}:${PORT}`);
});
