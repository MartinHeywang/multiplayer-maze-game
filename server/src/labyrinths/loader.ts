import fs from "fs";
import path from "path";

import { Cell, Labyrinth } from "otd-types";

export function loadRandomLabyrinth() {
    // not so random right now because there is only one labyrinth available
    const data = fs.readFileSync(path.resolve(__dirname, "0.txt"), "utf-8");

    const lines = data.split(/\r?\n/);
    let isFirstDataLine = true;

    let dimensions: { w: number; h: number } | null = null;
    const labyrinth: Labyrinth = [];

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

        let actualIndex = 0; // can't use the index provided by forEach because of the guard clauses
        line.split(" ").forEach(cellDescriptor => {
            if (/^\s*$/g.test(cellDescriptor)) return;
            if (actualIndex > dimensions!.h) return;

            const cell: Cell = {
                rightWall: false,
                bottomWall: false,
                start: false,
                exit: false,
            };

            const modifiers = new Set(cellDescriptor) as Set<Modifiers>;

            if (modifiers.has("B")) cell.bottomWall = true;
            if (modifiers.has("R")) cell.rightWall = true;
            if (modifiers.has("^")) cell.start = true;
            if (modifiers.has("$")) cell.exit = true;

            labyrinthRow.push(cell);
            actualIndex++;
        });

        labyrinth.push(labyrinthRow.slice(0, dimensions!.w));
    });

    return labyrinth;
}
