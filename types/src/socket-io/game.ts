import { Cell, Coord, Game, Labyrinth, Player } from "../data";

export interface CTSEvents {
    "game:watch": (watch: boolean) => void;
    "game:request-update": () => void;

    "game:join": () => void;
    "game:player-move": (direction: "up" | "left" | "right" | "down") => void;
}

export interface STCEvents {
    "game:update": (game: Game | null) => void;
    "game:error": (msg: string) => void;

    // in the future, we will change this to
    // game:cells (without giving the playerPos)
    // and game:players (giving the position of all players)

    "game:player-change": (
        dimensions: Labyrinth["dimensions"],
        updatedCells: Cell[][],
        playerPos: Coord
    ) => void;

    "game:winner": (player: Omit<Player, "hasJoinedNextGame">) => void;
}

export type SocketData = {
    playerCoord: Coord;
};
