import React, { useId, FC, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import "./scss/ServerSetup.scss";
import { useServerConnection } from "@/contexts/ServerConnectionContext";

interface Props {
    nextStep: () => void;
}

const ServerSetup: FC<Props> = ({ nextStep }) => {
    const [ready, setReady] = useState(false);

    const [autoMode, setAutoMode] = useState(process.env.NODE_ENV === "development" ? false : true);

    const { connect } = useServerConnection();
    const ipField = useRef<HTMLInputElement>(null);

    const id = useId();

    const messageParagraph = useRef<HTMLParagraphElement>(null);

    function setMessage(type: "valid" | "info" | "error", text: string) {
        if (!messageParagraph.current) return;

        messageParagraph.current.className = `message message--${type}`;
        messageParagraph.current.textContent = text;
    }

    function handleSubmit() {
        const ip = ipField.current?.value;


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

            <div className="checkbox-box">
                <label htmlFor={`${id}-checkbox`} className="checkbox-label">
                    Configuration automatique
                </label>
                <input
                    type="checkbox"
                    id={`${id}-checkbox`}
                    className="checkbox"
                    onChange={e => setAutoMode(e.target.checked)}
                    defaultChecked={autoMode}
                />
            </div>

            {autoMode === false && (
                <form className="form" onSubmit={e => e.preventDefault()}>
                    <label className="form-label" htmlFor={`${id}-field`}>
                        Entre l'IP du serveur ici&nbsp;:
                    </label>
                    <input
                        className="form-input"
                        id={`${id}-field`}
                        ref={ipField}
                        type="text"
                        onChange={() => setMessage("info", "")}
                        placeholder="ex. 192.168.0.1:8080"
                    />
                </form>
            )}

            <Button className="connect-btn" action={handleSubmit}>
                Se connecter
            </Button>

            <hr />

            <Button className="next-btn" disabled={!ready} action={nextStep}>
                Passer à l'étape 2
            </Button>
        </Card>
    );
};

export default ServerSetup;
