import Button from "@/components/ui/Button";
import React, { FC, useId, useRef } from "react";
import Card from "./Card";

import "./scss/PlayerSetup.scss";

interface Props {
    prevStep: () => void;
    done: () => void;
}

const PlayerSetup: FC<Props> = ({ prevStep, done }) => {
    const pseudoField = useRef<HTMLInputElement>(null);
    const pseudoFieldId = useId();

    function handlePseudoSubmit() {}

    return (
        <Card className="PlayerSetup">
            <header className="header">
                <div className="step-number">2</div>
                <p className="step-title">Créer son profil</p>
            </header>
            <p className="help">
                Ton profil est éphémère : une fois déconnecté, tu n'existes plus sur nos serveurs.
            </p>
            <p className="message"></p>

            <div className="player">
                <img
                className="avatar"
                    alt="ton avatar"
                    src="https://avatars.dicebear.com/api/open-peeps/martinheywang.svg"
                />
                <form className="form pseudo-form" onSubmit={e => e.preventDefault()}>
                    <label className="form-label" htmlFor={pseudoFieldId}>
                        Pseudo
                    </label>
                    <input
                        className="form-input"
                        id={pseudoFieldId}
                        ref={pseudoField}
                        type="text"
                        defaultValue={"Joueur001"}
                    />
                    <Button className="pseudo-btn" action={handlePseudoSubmit}>
                        Changer de pseudo
                    </Button>
                </form>
            </div>
            <Button action={() => {}}>Changer l'avatar (aléatoire)</Button>

            <hr />
            <Button action={done}>Je suis prêt à jouer!</Button>
        </Card>
    );
};

export default PlayerSetup;
