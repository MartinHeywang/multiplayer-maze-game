import { Server, Socket } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";

import { CTSEvents as PlayerCTS, STCEvents as PlayerSTC, SocketData as PlayerSD } from "./player";
import { CTSEvents as GameCTS, STCEvents as GameSTC, SocketData as GameSD } from "./game";

type CTSEvents = PlayerCTS & GameCTS;
type STCEvents = PlayerSTC & GameSTC;
type ISEvents = {};
type SocketData = { player: PlayerSD, game: GameSD };

type OurServer = Server<CTSEvents, STCEvents, ISEvents, SocketData>;
type OurSocket = Socket<CTSEvents, STCEvents, ISEvents, SocketData>;
type OurClientSocket = ClientSocket<STCEvents, CTSEvents>;

export { OurServer, OurSocket, OurClientSocket };
