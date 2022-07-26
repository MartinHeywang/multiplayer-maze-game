import { Player } from "../data/player";

export interface CTSEvents {
    "player:change-pseudo": (pseudo: string) => void;
    "player:change-avatar": () => void;

    "player:request-update": () => void;
}

export interface STCEvents {
    "player:update": (player: Partial<Player>) => void;
    "player:error": (message: string) => void;
}

export type SocketData = { id: string };
