import { v4 as uuidv4 } from "uuid";
import { Player } from "otd-types";

const players = new Map<string, Player>();

export const get = players.get;
export const list = players.values;
export const exists = players.has;

export function create(username = randomUsername()) {
    const id = uuidv4();

    const player: Player = {
        id,
        username,
        avatarUrl: randomAvatarUrl(),
        hasJoinedNextGame: false,
    };

    players.set(id, player);
    return player;
}

export function changeUsername(id: string, username: string) {
    const validation = checkUsername(username);
    if (!validation[0]) throw new Error(validation[1]);

    const editing = players.get(id);
    if (editing === undefined) throw new Error("Player not found.");
    
    const edited = { ...editing, username };
    players.set(id, edited);

    return edited;
}

export function changeAvatar(id: string) {
    const editing = players.get(id);
    if (editing === undefined) throw new Error("Player not found.");

    const edited = {...editing, avatarUrl: randomAvatarUrl()};
    players.set(id, edited);

    return edited;

}

export const remove = players.delete;

// UTILITY METHODS ------------------------------------------------------------

function checkUsername(username: string): [boolean, string] {
    const tooShort = username.length < 3;
    if (tooShort) return [false, "Min 3 caractères!"];

    const tooLong = username.length > 15;
    if (tooLong) return [false, "Max 15 caractères!"];

    return [true, "OK!"];
}

function randomUsername() {
    return `Joueur${Math.floor(Math.random() * 999)}`;
}

function randomAvatarUrl() {
    return `https://avatars.dicebear.com/api/open-peeps/${uuidv4()}.svg`;
}
