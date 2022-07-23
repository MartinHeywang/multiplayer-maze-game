import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import { useGame } from "@/contexts/GameContext";

import "./scss/GameEnd.scss";

const GameEnd: FC = () => {
    const navigate = useNavigate();
    const { winner } = useGame();

    return (
        <div className="GameEnd">
            <Container type="tight">
                <Card>
                    <h1>Fin du jeu!</h1>
                    <p>Vainqueur:</p>
                    <div className="player">
                        <img src={winner!.avatarUrl} alt="avatar"></img>
                        <span>{winner!.username}</span>
                    </div>
                    <Button action={() => navigate("/room")}>Retour à la salle d'attente</Button>
                </Card>
            </Container>
        </div>
    );
};

export default GameEnd;
