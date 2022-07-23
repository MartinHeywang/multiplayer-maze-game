export interface Game {
    status: "closed" | "opened" | "playing";
    plannedStartTime: Date;
}

export type Cell = {
    coord: Coord;

    rightWall: boolean;
    bottomWall: boolean;
    start: boolean;
    exit: boolean;
};

export type Coord = { x: number; y: number };

export type Labyrinth = {
    dimensions: { w: number; h: number };
    cells: Cell[][];
    startCoord: Coord;
    exitCoord: Coord;
};
