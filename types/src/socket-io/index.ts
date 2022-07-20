import { Server, Socket } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";

import { CTSEvents as PlayerCTS, STCEvents as PlayerSTC, SocketData as PlayerSD } from "./player";

type CTSEvents = PlayerCTS;
type STCEvents = PlayerSTC;
type ISEvents = {};
type SocketData = { player: PlayerSD };

type OurServer = Server<CTSEvents, STCEvents, ISEvents, SocketData>;
type OurSocket = Socket<CTSEvents, STCEvents, ISEvents, SocketData>;
type OurClientSocket = ClientSocket<STCEvents, CTSEvents>;

export { OurServer, OurSocket, OurClientSocket };
