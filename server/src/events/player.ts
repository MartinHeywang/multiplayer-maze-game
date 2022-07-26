import { OurSocket, Player } from "otd-types";
import * as players from "../models/players";

const id = (socket: OurSocket) => socket.data.player?.id;

export function registerSocket(socket: OurSocket) {
    const player = players.create();
    socket.data = { ...socket.data, player: { id: player.id } };

    socket.on("player:change-pseudo", changeUsername);
    socket.on("player:change-avatar", changeAvatar);
    socket.on("player:request-update", requestUpdate);
    socket.on("disconnect", () => players.remove(id(socket)!));

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
