export interface Game {
    status: "closed" | "opened" | "playing";
    plannedStartTime: Date;
}

export type Cell = {
    rightWall: boolean;
    bottomWall: boolean;
    start: boolean;
    exit: boolean;
};

export type Labyrinth = Cell[][];
