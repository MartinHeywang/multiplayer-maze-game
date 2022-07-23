import React, { useId, FC, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import "./scss/ServerSetup.scss";
import { useServerConnection } from "@/contexts/ServerConnectionContext";

interface Props {
    nextStep: () => void;
}   

const ServerSetup: FC<Props> = ({nextStep}) => {

    const [ready, setReady] = useState(false);

    const { connect } = useServerConnection();
    const ipField = useRef<HTMLInputElement>(null);
    const ipFieldID = useId();

    const messageParagraph = useRef<HTMLParagraphElement>(null);

    function setMessage(type: "valid" | "info" | "error", text: string) {
        if (!messageParagraph.current) return;

        messageParagraph.current.className = `message message--${type}`;
        messageParagraph.current.textContent = text;
    }

    function handleSubmit() {
        if (!ipField.current) return;

        const ip = ipField.current.value;

        console.log(`submit from with ip ${ip}`);

        connect!(ip)
            .then(() => {
                setMessage("valid", "Connexion réussie!");
                setReady(true);
            })
            .catch(err => {
                setMessage("error", err.message);
                setReady(false);
            });
    }

    return (
        <Card className="ServerSetup">
            <header className="header">
                <div className="step-number">1</div>
                <p className="step-title">Se connecter à un serveur.</p>
            </header>
            <p className="message" ref={messageParagraph}></p>
            <form className="form" onSubmit={e => e.preventDefault()}>
                <label className="form-label" htmlFor={ipFieldID}>
                    Entre l'IP du serveur ici&nbsp;:
                </label>
                <input className="form-input" id={ipFieldID} ref={ipField} type="text" onChange={() => setMessage("info", "")}/>
                <p className="help">
                    Une adresse IP est constituée de quatre nombres séparés par des points. Demande-la au
                    propriétaire du serveur si tu ne la connais pas!
                </p>
                <Button className="connect-btn" action={handleSubmit}>
                    Se connecter
                </Button>
            </form>

            <hr />

            <Button className="next-btn" disabled={!ready} action={nextStep}>
                Passer à l'étape 2
            </Button>
        </Card>
    );
};

export default ServerSetup;
