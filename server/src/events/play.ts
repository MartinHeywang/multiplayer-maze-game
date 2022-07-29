import { Cell, Coord, OurSocket, Player } from "otd-types";

import { io } from "..";

import * as playingGame from "../model/playingGame";
import { PlayingPlayer } from "../model/playingGame";

import { getGameRoomName } from "./game";
import { playerId, playerIdToSocket } from "./player";

let areEventsActivated = false;
export const enable = () => (areEventsActivated = true);
export const disable = () => (areEventsActivated = false);

export function registerSocket(socket: OurSocket) {
    const id = playerId(socket);
    if (id) return;
}

function allPlayers() {
    return io.to(getGameRoomName(playingGame.get()!, "players"));
}

export function sendStart() {
    allPlayers().emit("play:start");
}

export function sendCells(cells: Cell[], to?: Player[]) {
    const sockets = (() => {
        if (!to) return allPlayers();

        const playersId = to.map(player => player.id);
        const list: OurSocket[] = [];
        const map = playerIdToSocket.entries();

        let next = map.next();
        while (!next.done) {
            const { value } = next;
            if (playersId.includes(value[0])) list.push(value[1]);
        }

        return io.to(list.map(socket => socket.id));
    })();

    sockets.emit("play:cells", cells);
}

export function sendPlayer(player: PlayingPlayer) {
    allPlayers().emit("play:player", player.id, player.position);
}

export function sendWinner(player: Player & {position: Coord}) {

}
