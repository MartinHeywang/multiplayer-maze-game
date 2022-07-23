import { OurServer, OurSocket } from "otd-types";
import { Player } from "otd-types/src/data/player";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

export function registerSocket(_: OurServer, socket: OurSocket) {
    // creating a typed variable ensures that we provide all properties on Player
    // editSocketData() requires only a Partial<Player>, but in this case we need all
    // properties to be present
    const data: Player = {
        username: randomUsername(),
        avatarUrl: randomAvatarUrl(),
        hasJoinedNextGame: false,
    };

    editSocketData(socket, data);

    socket.on("player:change-pseudo", (username: string) => changeUsername(socket, username));
    socket.on("player:change-avatar", () => changeAvatar(socket));
    socket.on("player:request-update", () => socket.emit("player:update", socket.data.player!));
}

function randomUsername() {
    return `Joueur${Math.floor(Math.random() * 999)}`;
}

function randomAvatarUrl() {
    return `https://avatars.dicebear.com/api/open-peeps/${uuidv4()}.svg`;
}

export function editSocketData(socket: OurSocket, data: Partial<OurSocket["data"]["player"]>) {
    socket.data.player = {
        ...socket.data.player!,
        ...data,
    };

    socket.emit("player:update", socket.data.player!);
}

function emitError(socket: OurSocket, message: string) {
    socket.emit("player:error", message);
}

function checkUsername(username: string): [boolean, string] {
    const tooShort = username.length < 3;
    if (tooShort) return [false, "Min 3 caractères!"];

    const tooLong = username.length > 15;
    if (tooLong) return [false, "Max 15 caractères!"];

    return [true, "OK!"];
}

function changeUsername(socket: Socket, username: string) {
    const validation = checkUsername(username);
    if (!validation[0]) {
        console.log("change username validation error");
        console.log(validation[1]);
        return emitError(socket, validation[1]);
    }

    editSocketData(socket, { username });
}

function changeAvatar(socket: Socket) {
    editSocketData(socket, { avatarUrl: randomAvatarUrl() });
}
