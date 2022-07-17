import React, { FC } from "react";

import Container from "@/components/ui/Container";

import ServerSetup from "./ServerSetup";

import "./scss/Setup.scss";

const Setup: FC<{}> = () => {
    return (
        <div className="Setup">
            <Container type="tight">
                <ServerSetup />
            </Container>
        </div>
    );
};

export default Setup;
