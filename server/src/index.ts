import { Server } from "socket.io";

const io = new Server();

io.on("connection", socket => {
    console.log(`Socket ${socket.id} has just connected to the server!`);

    socket.on("disconnect", reason => {
        console.log(`Socket ${socket.id} got disconnected. (reason: ${reason})`);
    });
});

io.listen(5000);
