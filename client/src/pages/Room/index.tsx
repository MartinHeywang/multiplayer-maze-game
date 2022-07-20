import Container from "@/components/ui/Container";
import React, { FC } from "react";
import Card from "../Setup/Card";

import "./scss/Room.scss";

const Room: FC = () => {
    return (
        <div className="Room">
            <Container>
                <Card>Tu es dans la file d'attente</Card>
            </Container>
        </div>
    );
};

export default Room;
