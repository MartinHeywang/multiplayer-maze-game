import { Game } from "../data";

export interface CTSEvents {
    "game:watch": (watch: boolean) => void;
    "game:request-update": () => void;

    "game:join": () => void;
}

export interface STCEvents {
    "game:update": (game: Game | null) => void;
    "game:error": (msg: string) => void;

    "game:start": () => void;
}

export type SocketData = {};
