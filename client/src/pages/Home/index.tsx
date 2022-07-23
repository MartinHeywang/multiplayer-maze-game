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
                    <span className="Home__logo-text">
                        Le <span className="labyrinth">Labyrinthe</span> du <span className="koeb">Koeb'</span>
                    </span>
                </div>
                <Button action={() => navigate("/setup")} className="Home__btn">
                    C'est parti !
                </Button>
            </Container>
        </div>
    );
};

export default Home;
