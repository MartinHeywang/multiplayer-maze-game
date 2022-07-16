import React, { FC } from "react";

import "./scss/Container.scss";

interface Props {
    type?: "default" | "tight";
    children: React.ReactNode;
}

const Container: FC<Props> = ({ type = "default", children }) => {
    return <div className={`Container Container--${type}`}>{children}</div>;
};

export default Container;
