import { Game } from "../data";

export interface CTSEvents {
    "game:watch": (watch: boolean) => void;
    "game:request-update": () => void;

    "game:join": () => void;
}

export interface STCEvents {
    "game:update": (game: Game) => void;
    "game:error": (msg: string) => void;
}

export type SocketData = {};
