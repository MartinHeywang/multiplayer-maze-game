import React, { FC } from "react";

import { Cell as CellData } from "otd-types";

import "./scss/Cell.scss";

interface Props {
    cell: CellData | null | undefined;
}

const Cell: FC<Props> = ({ cell }) => {
    return (
        <>
            {cell ? (
                <div
                    className={`Cell ${cell?.bottomWall ? "Cell--bottom-wall" : ""} ${
                        cell?.rightWall ? "Cell--right-wall" : ""
                    } ${cell?.start ? "Cell--start" : ""} ${cell?.exit ? "Cell--exit" : ""}`}
                    style={{ gridRow: `${cell?.coord.y + 1} `, gridColumn: `${cell?.coord.x + 1}` }}
                ></div>
            ) : (
                <></>
            )}
        </>
    );
};

export default Cell;
