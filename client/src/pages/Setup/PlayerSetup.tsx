import Button from "@/components/ui/Button";
import { usePlayer } from "@/contexts/PlayerContext";
import { useServerConnection } from "@/contexts/ServerConnectionContext";
import React, { FC, useEffect, useId, useRef, useState } from "react";
import Card from "./Card";

import "./scss/PlayerSetup.scss";

interface Props {
    done: () => void;
}

const PlayerSetup: FC<Props> = ({ done }) => {
    const { socket } = useServerConnection();
    const { player, catchNextPlayerError } = usePlayer();

    const pseudoField = useRef<HTMLInputElement>(null);
    const pseudoFieldId = useId();

    const [message, setMessage] = useState<["info" | "valid" | "error", string]>(["info", ""]);

    function handlePseudoSubmit() {
        if (!pseudoField.current) return;
        if (!socket) return;

        const pseudo = pseudoField.current.value;

        setMessage(["info", ""]);

        catchNextPlayerError(error => {
            setMessage(["error", error]);
        });
        socket.emit("player:change-pseudo", pseudo);
    }

    useEffect(() => {
        if(!player?.username) return;

        setMessage(["info", `Pseudo: ${player!.username}`]);
    }, [player?.username]);

    function handleAvatarChange() {
        if (!socket) return;

        catchNextPlayerError(error => {
            setMessage(["error", error]);
        });
        socket.emit("player:change-avatar");
    }

    return (
        <Card className="PlayerSetup">
            <header className="header">
                <div className="step-number">2</div>
                <p className="step-title">Créer son profil</p>
            </header>
            <p className="help">
                Ton profil est éphémère : une fois déconnecté, tu n'existes plus sur nos serveurs.
            </p>
            <p className={`message message--${message[0]}`}>{message[1]}</p>

            <div className="player">
                <img className="avatar" alt="ton avatar" src={player?.avatarUrl} />
                <form className="form pseudo-form" onSubmit={e => e.preventDefault()}>
                    <label className="form-label" htmlFor={pseudoFieldId}>
                        Pseudo
                    </label>
                    <input
                        className="form-input"
                        id={pseudoFieldId}
                        ref={pseudoField}
                        type="text"
                        defaultValue={player?.username}
                    />
                    <Button className="pseudo-btn" action={handlePseudoSubmit}>
                        Changer de pseudo
                    </Button>
                </form>
            </div>
            <Button action={handleAvatarChange}>Changer l'avatar (aléatoire)</Button>

            <hr />
            <Button action={done}>Je suis prêt à jouer!</Button>
        </Card>
    );
};

export default PlayerSetup;
