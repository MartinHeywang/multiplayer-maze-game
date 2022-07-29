import { Game } from "otd-types";
import { v4 as uuidv4 } from "uuid";
import { io } from "..";

let games = new Set<Game>();

export function schedule(utcHour: number, utcMinute: number) {
    const startTime = (() => {
        const time = 1000 * 60 * 60 * utcHour + 1000 * 60 * utcMinute;
        const now = new Date();
        const lastMidnight = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

        const startTime = new Date(lastMidnight + time);

        // if the given time is before the next game, then schedule this game for tomorrow
        if (startTime < new Date())
            startTime.setTime(startTime.getTime() + 1000 * 60 * 60 * 24);

        return startTime;
    })();

    const game: Game = {
        id: uuidv4(),
        startTime,
        status: "closed",
    };

    games.add(game);

    return game;
}

export const list = () => games.values();

export function getNextGame() {
    const it = list();

    let nextGame: Game | null = null;

    let result = it.next();
    while (!result.done) {
        const { value } = result;

        if (
            nextGame === null || // fill the variable as soon as possible
            // then, two conditions:
            (nextGame.startTime > value.startTime && // this game comes sooner as the one in the variable
                nextGame.startTime > new Date()) // and starts in the future
        ) {
            nextGame = value;
        }

        result = it.next();
    }

    // cleanUp may contain long operations and is anyway not needed to compute the return value
    // wrapping it in a setImmediate ensures the code will not be blocked
    setImmediate(cleanUp);

    return nextGame;
}

// remove games that are not usable anymore
function cleanUp() {
    const array: Game[] = [];
    games.forEach(game => array.push(game));

    array.filter(game => game.startTime.getTime() > Date.now());

    games = new Set(array);
}
