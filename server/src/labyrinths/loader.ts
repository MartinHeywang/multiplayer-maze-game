import fs from "fs";
import path from "path";

import { Cell, Labyrinth } from "otd-types";

export function loadRandomLabyrinth() {
    // not so random right now because there is only one labyrinth available
    const data = fs.readFileSync(path.resolve(__dirname, "0.txt"), "utf-8");

    const lines = data.split(/\r?\n/);
    let isFirstDataLine = true;

    const labyrinth: Labyrinth = {
        cells: [],
        startCoord: { x: -1, y: -1 },
        exitCoord: { x: -1, y: -1 },
        dimensions: { w: -1, h: -1 },
    };

    let y = 0;
    lines.forEach(line => {
        if (line.startsWith("#")) return; // comments
        if (/^\s*$/g.test(line)) return; // empty lines
        
        if (isFirstDataLine) {
            const dimArray = line.split("x");
            labyrinth.dimensions = {
                w: parseInt(dimArray[0]),
                h: parseInt(dimArray[1]),
            };
            
            isFirstDataLine = false;
            return;
        }

        if (y >= labyrinth.dimensions.h) return;

        type Modifiers =
            | "R" // wall on the right
            | "B" // wall on the bottom
            | "^" // start of the labyrinth
            | "$"; // exit of the labyrinth

        let x = 0; // can't use the index provided by forEach because of the guard clauses
        line.split(" ").forEach(cellDescriptor => {
            if (/^\s*$/g.test(cellDescriptor)) return;
            if (x >= labyrinth.dimensions.w) return;

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
                cell.exit = true;
                labyrinth.exitCoord = { x, y };
            }

            labyrinth.cells[y] ||= [];
            labyrinth.cells[y][x] = cell;
            x++;
        });

        y++;
    });

    return labyrinth;
}
