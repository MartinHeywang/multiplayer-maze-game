import { Cell, Coord, Game, Labyrinth, Player } from "../data";

export interface CTSEvents {
    "game:request-update": () => void;
    "game:join": () => void;
}

export interface STCEvents {
    "game:update": (game: Partial<Game & { joined: boolean }> | null) => void;
    "game:error": (msg: string) => void;
}

export type SocketData = {};
