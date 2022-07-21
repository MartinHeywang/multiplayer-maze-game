import fs from "fs";
import path from "path";

import { Cell, Labyrinth } from "otd-types";

export function loadRandomLabyrinth() {
    // not so random right now because there is only one labyrinth available
    const data = fs.readFileSync(path.resolve(__dirname, "0.txt"), "utf-8");

    const lines = data.split(/\r?\n/);
    let isFirstDataLine = true;

    let dimensions: { w: number; h: number } | null = null;
    const labyrinth: Labyrinth = {
        cells: [],
        startCoord: { x: -1, y: -1 },
        exitCoord: { x: -1, y: -1 },
    };

    let y = 0;
    lines.forEach(line => {
        if (line.startsWith("#")) return;

        if (isFirstDataLine) {
            const dimArray = line.split("x");
            dimensions = {
                w: parseInt(dimArray[0]),
                h: parseInt(dimArray[1]),
            };

            isFirstDataLine = false;
            return;
        }

        const labyrinthRow: Cell[] = [];

        type Modifiers =
            | "R" // wall on the right
            | "B" // wall on the bottom
            | "^" // start of the labyrinth
            | "$"; // exit of the labyrinth

        let x = 0; // can't use the index provided by forEach because of the guard clauses
        line.split(" ").forEach(cellDescriptor => {
            if (/^\s*$/g.test(cellDescriptor)) return;

            const cell: Cell = {
                coord: { x, y },
                rightWall: false,
                bottomWall: false,
                start: false,
                exit: false,
            };

            const modifiers = new Set(cellDescriptor) as Set<Modifiers>;

            if (modifiers.has("B")) cell.bottomWall = true;
            if (modifiers.has("R")) cell.rightWall = true;

            if (modifiers.has("^")) {
                cell.start = true;
                labyrinth.startCoord = { x, y };
            } else if (modifiers.has("$")) {
                cell.start = true;
                labyrinth.exitCoord = { x, y };
            }

            labyrinthRow.push(cell);
            x++;
        });

        labyrinth.cells.push(labyrinthRow.slice(0, dimensions!.w));
        y++;
    });

    labyrinth.cells = labyrinth.cells.slice(0, dimensions!.h);

    return labyrinth;
}
