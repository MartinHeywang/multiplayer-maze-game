import { OurSocket, Player } from "otd-types";
import * as players from "../model/players";

const id = (socket: OurSocket) => socket.data.player?.id;
export const playerId = id;

export const playerIdToSocket = new Map<string, OurSocket>();

export function registerSocket(socket: OurSocket) {
    const player = players.create();
    socket.data = { ...socket.data, player: { id: player.id } };
    playerIdToSocket.set(player.id, socket);

    socket.on("player:change-pseudo", changeUsername);
    socket.on("player:change-avatar", changeAvatar);
    socket.on("player:request-update", requestUpdate);
    socket.on("disconnecting", () => players.remove(id(socket)!));

    const caught = (cb: () => Partial<Player>) => {
        const update = (player: Partial<Player>) => socket.emit("player:update", player);
        const error = (msg: string) => socket.emit("player:error", msg);

        try {
            const returned = cb();
            update(returned);
        } catch (msg) {
            error(msg as string);
        }
    };

    function changeUsername(username: string) {
        caught(() => {
            const player = players.changeUsername(id(socket)!, username);
            return { username: player.username };
        });
    }

    function changeAvatar() {
        caught(() => {
            const player = players.changeAvatar(id(socket)!);
            return { avatarUrl: player.avatarUrl };
        });
    }

    function requestUpdate() {
        caught(() => {
            const player = players.get(id(socket)!);
            if (!player) throw new Error("Player not found.");

            return player;
        });
    }
}
