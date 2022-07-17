import React, { useId, FC } from "react";

import Button from "@/components/ui/Button";
import Card from "./Card";

import "./scss/ServerSetup.scss";

const ServerSetup: FC = () => {
    const id = useId();

    return (
        <Card className="ServerSetup">
            <header className="header">
                <div className="step-number">1</div>
                <p className="step-title">Se connecter à un serveur.</p>
            </header>
            <p className="message message--info"></p>
            <form className="form" onSubmit={e => e.preventDefault()}>
                <label className="form-label" htmlFor={id}>
                    Entre l'IP du serveur ici&nbsp;:
                </label>
                <input className="form-input" id={id} type="text" />
                <p className="help">
                    Une adresse IP est constituée de quatre nombres séparés par des points. Demande-la au
                    propriétaire du serveur si tu ne la connais pas!
                </p>
                <Button className="connect-btn" action={() => {}}>
                    Se connecter
                </Button>
            </form>

            <hr />

            <Button className="next-btn" disabled action={() => {}}>
                Passer à l'étape 2
            </Button>
        </Card>
    );
};

export default ServerSetup;
