import { NextGame } from "./nextGame";

import * as gameEvents from "../events/game";
import * as playEvents from "../events/play";

import { Cell, Coord, Labyrinth, Player } from "otd-types";
import { loadRandomLabyrinth } from "../labyrinths/loader";

export type PlayingPlayer = Player & { position: Coord };

export type PlayingGame = Omit<NextGame, "status" | "players"> & {
    status: "preparing" | "playing";
    players: Set<PlayingPlayer>;
    labyrinth: Labyrinth;
};

let game: PlayingGame | null = null;

export const get = () => game;

export function start(newGame: NextGame) {
    const labyrinth = loadRandomLabyrinth();

    const playersWithPos = new Set<PlayingPlayer>(
        Array.from(newGame.players, player => ({
            ...player,
            // cloning here because we don't want to keep the reference
            position: JSON.parse(JSON.stringify(labyrinth.startCoord)),
        }))
    );

    game = { ...newGame, status: "playing", players: playersWithPos, labyrinth };
    gameEvents.notifyGameStatusChange("playing");

    playEvents.sendStart();

    // wait a bit so that every client is able to set up their listeners for that event
    setTimeout(() => {
        playEvents.sendCells(getCellsAround(labyrinth.startCoord));
        playEvents.sendPlayers(...game!.players);
    }, 3000);

    playEvents.enable();
}

function end() {
    game = null;

    playEvents.disable();
}

function getCellsAround(coord: Coord) {
    if (!game) throw new Error("No game is playing right now.");

    const labyrinth = game.labyrinth;
    const minX = Math.max(coord.x - 2, 0);
    const minY = Math.max(coord.y - 2, 0);
    const maxX = Math.min(minX + 4, labyrinth.dimensions.w - 1);
    const maxY = Math.min(minY + 4, labyrinth.dimensions.h - 1);

    let result: Cell[] = [];

    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const cell = labyrinth.cells[y][x];
            result.push(cell);
        }
    }

    return result;
}

export function move(playerId: string, direction: "up" | "left" | "right" | "down") {
    if (!game) throw new Error("No game is playing right now.");

    const player = Array.from(game.players).find(player => player.id === playerId);
    if (!player) throw new Error("Player not found!");

    const oldPos = player.position;
    const diff = {
        up: { x: 0, y: -1 },
        right: { x: 1, y: 0 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
    };
    const newPos = { x: oldPos.x + diff[direction].x, y: oldPos.y + diff[direction].y };

    const isMoveImpossible = () => {
        try {
            // find out if there's a wall
            if (direction === "up") return game!.labyrinth.cells[oldPos.y - 1][oldPos.x].bottomWall;
            if (direction === "left") return game!.labyrinth.cells[oldPos.y][oldPos.x - 1].rightWall;
            if (direction === "right") return game!.labyrinth.cells[oldPos.y][oldPos.x].rightWall;
            if (direction === "down") return game!.labyrinth.cells[oldPos.y][oldPos.x].bottomWall;
        } catch {
            // index out of bound error
            // e.g if you try to go up but you're already at the top of the labyrinth
            // -> impossible move
            return true;
        }
    };

    if (isMoveImpossible()) return;

    player.position = newPos;
    playEvents.sendPlayers(player);
    playEvents.sendCells(getCellsAround(newPos), [player]);

    if (newPos.x === game!.labyrinth.exitCoord.x && newPos.y === game!.labyrinth.exitCoord.y) {
        playEvents.sendWinner(player);
    }
}
