import { Server, Socket } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";

type CTSEvents = {};
type STCEvents = {};
type ISEvents = {};
type SocketData = {};

type OurServer = Server<CTSEvents, STCEvents, ISEvents, SocketData>;
type OurSocket = Socket<CTSEvents, STCEvents, ISEvents, SocketData>;
type OurClientSocket = ClientSocket<STCEvents, CTSEvents>;

export { OurServer, OurSocket, OurClientSocket };
