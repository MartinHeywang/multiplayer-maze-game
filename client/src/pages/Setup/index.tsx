import React, { FC, useState } from "react";

import Container from "@/components/ui/Container";

import ServerSetup from "./ServerSetup";

import "./scss/Setup.scss";
import PlayerSetup from "./PlayerSetup";

const Setup: FC<{}> = () => {
    const [step, setStep] = useState(0);

    return (
        <div className="Setup">
            <Container type="tight">
                {[<ServerSetup nextStep={() => setStep(old => old + 1)} />, <PlayerSetup done={() => {}}/>][step]}
            </Container>
        </div>
    );
};

export default Setup;
