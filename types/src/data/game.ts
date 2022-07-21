export interface Game {
    status: "closed" | "opened" | "playing";
    plannedStartTime: Date;
}