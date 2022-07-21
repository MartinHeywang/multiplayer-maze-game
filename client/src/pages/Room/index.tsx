import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";

import { useGame } from "@/contexts/GameContext";
import { usePlayer } from "@/contexts/PlayerContext";

import { formatDuration, formatHour } from "@/utils/formatTime";

import "./scss/Room.scss";
import Button from "@/components/ui/Button";
import { useServerConnection } from "@/contexts/ServerConnectionContext";

const Room: FC = () => {
    const { socket } = useServerConnection();
    const { player } = usePlayer();
    const { game } = useGame();

    const navigate = useNavigate();

    const [countdownText, setCountdownText] = useState("calcul...");

    useEffect(() => {
        if (socket && player && game) return;

        navigate("/setup");
    });

    useEffect(() => {
        if (!game) return;

        console.log(game.plannedStartTime);

        const interval = setInterval(() => {
            setCountdownText(formatDuration(game.plannedStartTime.getTime() - Date.now()));
        }, 1000);

        return () => clearInterval(interval);
    }, [game]);

    return (
        <div className="Room">
            <Container type="tight">
                {socket && player && game && <Card>
                    <h1>Salle d'attente</h1>
                    <p>Prochaine partie dans :</p>
                    <p className="countdown">{countdownText}</p>

                    <h2>Inscription</h2>
                    {game!.status !== "opened" ? (
                        <p>
                            Il est encore impossible de rejoindre cette partie. Il devient possible de
                            rejoindre une partie à partir de 5 minutes avant son début.
                        </p>
                    ) : !player!.hasJoinedNextGame ? (
                        <>
                            <p>L'inscription est ouverte!</p>
                            <Button action={() => socket!.emit("game:join")}>Rejoindre!</Button>
                        </>
                    ) : (
                        <p>Tu as rejoins cette partie. Amuses-toi bien&nbsp;!</p>
                    )}
                </Card>}
            </Container>
        </div>
    );
};

export default Room;
