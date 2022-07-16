import React, { FC } from "react";

import "./scss/Button.scss";

interface Props {
    children: string;
    className?: string;

    disabled?: boolean;

    action: (e: React.MouseEvent) => void;
}

const Button = React.forwardRef<HTMLButtonElement, Props>(
    ({ children, action, className = "", disabled = false }, ref) => {
        return (
            <button
                ref={ref}
                className={`Button ${className} ${disabled ? "Button--disabled" : ""}`}
                onClick={action}
                disabled={disabled}
            >
                {children}
            </button>
        );
    }
);

export default Button;
