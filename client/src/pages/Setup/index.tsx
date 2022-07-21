import React, { FC, useState } from "react";

import Container from "@/components/ui/Container";

import ServerSetup from "./ServerSetup";

import "./scss/Setup.scss";
import PlayerSetup from "./PlayerSetup";
import { useNavigate } from "react-router-dom";

const Setup: FC<{}> = () => {
    const [step, setStep] = useState(0);

    const navigate = useNavigate();

    return (
        <div className="Setup">
            <Container type="tight">
                {[<ServerSetup nextStep={() => setStep(old => old + 1)} />, <PlayerSetup done={() => navigate("/room")}/>][step]}
            </Container>
        </div>
    );
};

export default Setup;
