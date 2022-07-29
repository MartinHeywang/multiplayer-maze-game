import { Game, Player } from "otd-types";

import * as players from "./players";
import * as games from "./games";
import * as play from "./playingGame";

import * as gameEvents from "../events/game";

export type NextGame = Omit<Game, "status"> & {
    status: "closed" | "opened" /* but not 'playing' */;
    players: Set<Player>;
};

let game: NextGame | null = null;

export const get = () => game;

// this function is exported so it can be called from the main file
// when the server is ready
export function handleGameWhenAvailable() {
    const interval = setInterval(() => {
        const temp = games.getNextGame();
        if (temp === null) return;

        initiateNextGame(temp);
        clearInterval(interval);
    }, 5000);
}

function initiateNextGame(newGame: Game) {
    game = { ...newGame, players: new Set(), status: "closed" };

    gameEvents.enable();

    const fiveMinutesBeforeGameStart = game.startTime.getTime() - 1000 * 60 * 5 - Date.now();
    const onGameStart = game.startTime.getTime() - Date.now();

    setTimeout(openInscription, fiveMinutesBeforeGameStart);
    setTimeout(startGame, onGameStart);
}

function openInscription() {
    if (!game) /* should never happen */ return;

    game.status = "opened";
    gameEvents.notifyGameStatusChange("opened");
}

function startGame() {
    if (!game) /* should never happen */ return;

    play.start(game);
    game = null;

    gameEvents.disable();
}

export function join(playerId: string) {
    if (!game || game.status !== "opened") throw new Error("No game is joinable right now.");

    const player = players.get(playerId);
    if (!player) throw new Error("Player not found!");

    game.players.add(player);

    return game;
}

export function leave(gameId: string, playerId: string) {
    if (!game || game.status !== "opened") return;
    if (game.id !== gameId) return;

    const player = players.get(playerId);
    if (!player) throw new Error("Player not found!");

    game.players.delete(player);

    return game;
}
