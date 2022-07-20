import React, { FC } from "react";

import "./scss/Loading.scss";

const Loading: FC = () => {
    return (
        <svg className="Loading" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M25 47C37.1503 47 47 37.1503 47 25H50C50 38.8071 38.8071 50 25 50C25 50 25 50 25 50V47C25 47 25 47 25 47ZM3.00003 25C3.00003 12.8497 12.8498 3 25 3V0C11.1929 0 3.05176e-05 11.1929 3.05176e-05 25H3.00003Z"
                fill="var(--clr-neutral-900)"
            />
        </svg>
    );
};

export default Loading;
