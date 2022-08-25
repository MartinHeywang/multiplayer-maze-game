import { Cell, Coord } from "../data/game";
import { Player } from "../data/player";

export interface CTSEvents {
    "play:move": (dir: "up" | "right" | "down" | "left") => void;
}

export interface STCEvents {
    "play:start": () => void;
    "play:end": (winner: Player) => void;

    "play:cells": (cells: Cell[]) => void;
    "play:players": (...players: (Player & { position: Coord })[]) => void;
}
