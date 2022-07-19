import { Player } from "../data/player";

export interface CTSEvents {
    "player:change-pseudo": (pseudo: string) => void;
    "player:change-avatar": () => void;
}

export interface STCEvents {
    "player:update": (player: Player) => void;
    "player:error": (error: Error) => void;
}

export type SocketData = Player;
