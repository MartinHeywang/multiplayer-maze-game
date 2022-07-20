import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

import logo from "@/assets/favicon.svg";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

import "./scss/Home.scss";

const Home: FC<{}> = () => {

    const navigate = useNavigate();

    return (
        <div className="Home">
            <Container type="tight">
                <div className="Home__logo">
                    <img className="Home__logo-img" src={logo} />
                    <span className="Home__logo-text">Tower Defense multi-joueur</span>
                </div>
                <p>Le jeu est en cours de développement!</p>
                <Button action={() => navigate("/setup")} className="Home__btn">C'est parti !</Button>
            </Container>
        </div>
    );
};

export default Home;
