var puzzles = (function () {
    var nextPuzzle = 0;
    var getPuzzle = function () {
        var puzzles = [
            //[ ".........", ".........", ".........", ".........", ".........", ".........", ".........", ".........", "........." ],
            [
                "1...2....",
                ".6...852.",
                "28...97..",
                "...3...6.",
                ".5...69..",
                "....9..4.",
                "......6..",
                ".9.....57",
                "..6..7.89",
            ],
            [
                ".....123.",
                "123..8.4.",
                "8.4..765.",
                "765......",
                ".........",
                "......123",
                ".123..8.4",
                ".8.4..765",
                ".765.....",
            ],
            [
                "7...48...",
                ".5.....24",
                ".....9..1",
                ".2.....5.",
                "3.9.5...6",
                "...47..3.",
                "....1..4.",
                "18....69.",
                "2..7.....",
            ],
            [
                "7......4.",
                ".....827.",
                ".4.9.5...",
                "8.9..3...",
                "5.3...6.2",
                "...1..3.8",
                "...5.7.2.",
                ".564.....",
                ".9......3",
            ],
            [
                "...37....",
                "26.......",
                ".3.8...47",
                "9.3..7.1.",
                ".4.....3.",
                ".7.9..4.6",
                "51...2.7.",
                ".......21",
                "....18...",
            ],
            [
                "..4.5..2.",
                "3....97.6",
                "....78..3",
                ".15...8..",
                ".......5.",
                ".62...3..",
                "....17..5",
                "1....64.2",
                "..3.9..8.",
            ],
            [
                "...43....",
                "..9.2.8..",
                ".....7.29",
                ".5....1.3",
                "..62.57..",
                "8.1....6.",
                "14.9.....",
                "..2.6.9..",
                "....43...",
            ],
            [
                "....9....",
                "...2.7..6",
                "...6.571.",
                ".2756..4.",
                "5..3...2.",
                ".84...6..",
                "..9..3..5",
                "..572...3",
                ".3....268",
            ],
            [
                "...9...21",
                "....358..",
                "....1..5.",
                ".6......9",
                "..27.43..",
                "5......1.",
                ".1..2....",
                "..615....",
                "78...6...",
            ],
            [
                "5....39..",
                "....6....",
                "..21...75",
                "7.....34.",
                "...2.7...",
                ".86.....7",
                "97...65..",
                "....5....",
                "..58....2",
            ],
        ];
        if (nextPuzzle >= puzzles.length) {
            nextPuzzle = 0;
        }
        return puzzles[nextPuzzle++];
    };

    return {
        getPuzzle: getPuzzle,
    };
})();

var killers = (function () {
    var nextKiller = 0;
    var getKiller = function () {
        const L = "L";
        const R = "R";
        const U = "U";
        const D = "D";
        var killers = [
            [
                [10, L, 20, L, L, 11, L, L, 13],
                [20, 21, U, 15, L, L, L, 22, U],
                [U, U, L, L, 9, 22, L, U, L],
                [U, L, 23, 11, U, 12, U, 12, L],
                [21, 12, U, U, U, U, U, U, L],
                [U, U, U, L, 18, L, 17, L, 20],
                [U, 10, 12, L, U, 28, L, U, U],
                [U, U, 9, L, R, U, 3, L, U],
                [R, U, 20, L, L, L, 14, L, U],
            ],
            [
                [24, L, L, 20, L, L, 24, L, 16],
                [U, U, 10, L, 23, U, U, U, U],
                [18, L, L, U, U, L, L, 14, U],
                [19, L, U, 22, L, 20, L, U, U],
                [U, 28, L, L, U, U, U, 10, L],
                [U, 18, U, U, 8, 21, L, U, 27],
                [R, U, 10, L, U, U, 4, U, U],
                [U, 20, L, L, U, 16, U, 12, U],
                [4, L, 17, L, L, U, L, U, U],
            ],
            [
                ([15, L, 18, L, 22, L, 4, L, 20],
                [U, U, 17, U, U, U, 15, L, U],
                [25, L, U, 8, L, 8, L, U, U],
                [U, U, 8, L, 17, 21, L, L, L],
                [14, L, L, U, U, L, 7, 25, L],
                [15, 9, L, 19, 16, 16, U, U, U],
                [U, 12, L, U, U, U, U, 9, L],
                [U, 5, L, U, U, U, 27, L, L],
                [12, L, 21, L, L, L, L, U, U]),
            ],
            [
                [14, L, 16, L, L, 6, L, 9, L],
                [7, L, 13, L, 8, L, 16, L, 12],
                [14, 15, 3, L, 7, 23, L, L, U],
                [U, U, 12, L, U, 12, 10, U, U],
                [12, U, 8, 17, 8, U, U, 14, L],
                [U, L, U, U, U, 14, 4, 13, L],
                [5, 17, 13, 6, U, U, U, 12, U],
                [U, U, U, U, 16, 4, 12, U, 17],
                [6, L, 10, L, U, U, U, U, U],
            ],
            [
                [15, L, L, L, 22, L, L, 15, L],
                [21, L, 10, L, U, 21, L, 8, 23],
                [U, 20, L, L, 23, 9, U, U, U],
                [U, 17, L, U, U, U, U, U, U],
                [R, U, 21, L, U, L, 8, L, 19],
                [U, 21, U, 7, L, 10, R, R, U],
                [20, U, L, 23, L, U, L, 20, L],
                [U, 9, L, U, L, 25, L, U, 7],
                [U, L, L, 11, L, U, L, U, U],
            ],
            // HARD 135 steps
            [
                [25, L, L, L, 8, L, 11, L, 20],
                [8, 10, L, 20, L, 16, L, L, U],
                [U, L, 16, 5, U, L, 8, R, U],
                [12, L, U, U, 11, L, U, 11, L],
                [15, L, 18, L, 6, 25, L, U, 14],
                [U, 17, U, 5, U, U, 21, L, U],
                [7, U, U, U, 18, U, U, U, 8],
                [U, U, L, 20, U, 6, 23, L, U],
                [15, L, R, U, U, U, U, 6, L],
            ],
            // DEADLY 133 steps
            [
                [15, L, 10, 11, 20, L, L, 6, L],
                [R, R, U, U, 13, L, 23, 20, L],
                [20, 21, L, U, U, R, U, U, U],
                [U, L, U, U, U, 16, L, 17, L],
                [7, 19, 20, L, L, U, U, U, 24],
                [U, U, 11, 25, L, 9, L, 14, U],
                [R, U, U, U, U, L, U, U, U],
                [9, L, U, 22, L, L, 16, 9, U],
                [18, L, L, L, 10, L, U, U, L],
            ],
            /*
                        [
                            [0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        ],
        */
        ];
        if (nextKiller >= killers.length) {
            nextKiller = 0;
        }
        return killers[nextKiller++];
    };

    return {
        getKiller: getKiller,
    };
})();

var grid = (function () {
    var theGrid;
    var killer = false;

    var getGrid = function () {
        return theGrid;
    };

    var cellId = function (row, col) {
        return "#g" + row + col;
    };

    class Cell {
        constructor(row, col) {
            this.row = row;
            this.col = col;
            this.value = undefined;
        }
    }

    class Cage {
        static theGrid;
        static initCage(theGrid) {
            Cage.theGrid = theGrid;
        }

        constructor(
            total,
            locations,
            virtual = false,
            nodups = true,
            source = ""
        ) {
            this.total = total;
            this.cells = [];
            this.virtual = virtual;
            this.nodups = nodups;
            this.source = source;

            // Get cage cells
            locations.forEach((element) => {
                let cell = Cage.theGrid.cells[element[0] - 1][element[1] - 1];
                this.cells.push(cell);
            });
            // Check for duplicate virtual cage - look at cages for first cell
            if (virtual) {
                let cages = this.cells[0].cages;
                let duplicate = null;
                for (const cage of cages) {
                    if (cage.total != this.total) continue;
                    if (cage.cells.length != this.cells.length) continue;
                    let difference = cage.cells.filter(
                        (x) => !this.cells.includes(x)
                    );
                    if (difference.length > 0) continue;
                    duplicate = cage;
                    // The cage will be a zombie
                    this.zombie = true;
                    return;
                }
            }
            // Set cage for cells
            this.zombie = false;
            // Set cage for cells
            this.cells.forEach((cell) => {
                if (!virtual) {
                    cell.cage = this;
                }
                if (!cell.cages) {
                    cell.cages = [this];
                } else {
                    cell.cages.push(this);
                }
            });
            // Add cage to the grid display
            if (!virtual) {
                if (Cage.theGrid.cages == null) {
                    Cage.theGrid.cages = [this];
                } else {
                    Cage.theGrid.cages.push(this);
                }
            }
        }

        remove() {
            this.cells.forEach((cell) => {
                cell.cage = null;
                cell.value = null;
            });
            Cage.theGrid.cages = Cage.theGrid.cages.filter((x) => x != this);
        }
    }

    class Grid {
        constructor() {
            this.cells = new Array(9);
            for (var row = 1; row < 10; row++) {
                this.cells[row - 1] = new Array(9);
                for (var col = 1; col < 10; col++) {
                    let cell = new Cell(row, col);
                    this.cells[row - 1][col - 1] = cell;
                    displayCell(cell);
                }
            }
        }

        setCell(row, col, entry) {
            var cell = this.cells[row - 1][col - 1];
            var value = Number(entry);
            if (entry != null && cell.value != value) {
                cell.value = value;
            } else if (entry == null && cell.value != null) {
                cell.value = null;
            }
            displayCell(cell);
        }

        clearCell(row, col) {
            setCell(row, col, null);
        }

        adjacentCells(cell) {
            let row = cell.row;
            let col = cell.col;
            let cells = [];
            if (row > 1) {
                cells.push(theGrid.cells[row - 2][col - 1]);
            }
            if (row < 9) {
                cells.push(theGrid.cells[row][col - 1]);
            }
            if (col > 1) {
                cells.push(theGrid.cells[row - 1][col - 2]);
            }
            if (col < 9) {
                cells.push(theGrid.cells[row - 1][col]);
            }
            return cells;
        }

        colourCages() {
            for (let cage of theGrid.cages) {
                cage.oldColour = cage.colour;
                cage.colour = undefined;
            }
            for (let cage of theGrid.cages) {
                let adjacentCells = [];
                for (let cell of cage.cells) {
                    adjacentCells.push(...this.adjacentCells(cell));
                }
                adjacentCells = adjacentCells.filter(
                    (n) => !cage.cells.includes(n)
                );
                let adjacentCages = adjacentCells.map((x) => x.cage);
                adjacentCages = adjacentCages.filter((c) => c != undefined);
                let adjacentColours = adjacentCages.map((c) => c.colour);
                cage.colour = 1;
                while (adjacentColours.includes(cage.colour)) {
                    cage.colour++;
                }
            }
            //* display all cells in updated cages
            for (let cage of theGrid.cages) {
                if (cage.oldColour != cage.colour) {
                    for (const cell of cage.cells) {
                        displayCell(cell);
                    }
                }
            }
        }

        setCage(row, col, entry) {
            let cage = null;
            if (["D", "L", "R", "U"].includes(entry)) {
                // Get cage from referenced cell
                let r = row;
                let c = col;
                if (entry == "D") r++;
                if (entry == "L") c--;
                if (entry == "R") c++;
                if (entry == "U") r--;
                if (r >= 1 && r <= 9 && c >= 1 && c <= 9) {
                    cage = this.cells[r - 1][c - 1].cage;
                    if (cage != undefined) {
                        let cell = this.cells[row - 1][col - 1];
                        cage.cells.push(cell);
                        cell.cage = cage;
                        cell.cages = [cage];
                        cell.value = entry;
                        displayCell(cell);
                    }
                }
            } else {
                let value = Number(entry);
                let cell = this.cells[row - 1][col - 1];
                cage = cell.cage;
                if (cage === undefined || cage == null) {
                    cage = new Cage(value, [[row, col]]);
                    cell.value = value;
                    displayCell(cell);
                } else if (cage.cells[0] === cell) {
                    // Can only update first cell of cage
                    let newTotal = cage.total * 10 + value;
                    if (newTotal <= 90) {
                        cage.total = newTotal;
                        cell.value = newTotal;
                        displayCell(cell);
                    }
                }
            }
            if (cage != null) {
                this.colourCages();
            }
            return cage;
        }

        removeCage(row, col) {
            var cell = this.cells[row - 1][col - 1];
            if (cell.cage != undefined) {
                let cells = cell.cage.cells;
                cell.cage.remove();
                cell.cages = [];
                for (const cell of cells) {
                    var id = cellId(cell.row, cell.col);
                    $(id).removeClass("c1");
                    $(id).removeClass("c2");
                    $(id).removeClass("c3");
                    $(id).removeClass("c4");
                    displayCell(cell);
                }
            }
        }
    }

    var initGrid = function (isKiller) {
        killer = isKiller;
        theGrid = new Grid();
        Cage.initCage(theGrid);
    };

    var displayCell = function (cell) {
        var id = cellId(cell.row, cell.col);
        var html = "";
        // If killer then add cage value
        if (cell.cage != undefined) {
            if (cell.cage.cells[0] == cell) {
                html = '<div class="cage">' + cell.cage.total + "</div>";
            } else {
                html = '<div class="cage">' + cell.value + "</div>";
            }
        } else {
            if (cell.value == null) {
                var text = "";
                html += '<div class="possible">' + text + "</div>";
            } else {
                html += '<div class="known">' + cell.value + "</div>";
            }
        }
        $(id).html(html);
        // If killer then colour cell
        if (cell.cage != undefined) {
            let colour = cell.cage.colour;
            $(id).removeClass("c1");
            $(id).removeClass("c2");
            $(id).removeClass("c3");
            $(id).removeClass("c4");
            if (colour != undefined) {
                let colourClass = "c" + colour;
                $(id).addClass(colourClass);
            }
        }
    };

    var setCell = function (row, col, entry) {
        if (!killer) {
            theGrid.setCell(row, col, entry);
        } else {
            // Cage value
            let cage = theGrid.setCage(row, col, entry);
            if (cage == null) {
                return null;
            }
        }

        let cell = theGrid.cells[row - 1][col - 1];
        displayCell(cell);
        return cell;
    };

    var removeCell = function (row, col) {
        if (!killer) {
            theGrid.clearCell(row, col);
        } else {
            // Cage value
            theGrid.removeCage(row, col);
        }

        displayCell(theGrid.cells[row - 1][col - 1]);
    };

    var setPuzzle = function (puzzle) {
        initGrid(false);
        for (var row = 1; row < 10; row++) {
            for (var col = 1; col < 10; col++) {
                let entry = puzzle[row - 1][col - 1];
                if (entry != ".") {
                    setCell(row, col, entry);
                }
            }
        }
    };

    var getPuzzle = function () {
        let puzzle = new Array(9);
        for (let row = 1; row < 10; row++) {
            puzzle[row - 1] = new Array(9);
            for (let col = 1; col < 10; col++) {
                let entry = theGrid.cells[row - 1][col - 1].value;
                if (entry == null) entry = ".";
                puzzle[row - 1][col - 1] = entry;
            }
        }
        return puzzle;
    };

    var validatePuzzle = function () {
        let message = "";
        // values cannot be duplicated in row, column or square
        for (let r = 1; r <= 9; r++) {
            let row = theGrid.cells[r - 1];
            let set = new Array(9);
            for (let c = 1; c <= 9; c++) {
                let cell = row[c - 1];
                if (cell.value != null) {
                    if (set[cell.value - 1]) {
                        message +=
                            "\nRow[" +
                            r +
                            "] has duplicate value " +
                            cell.value;
                    } else {
                        set[cell.value - 1] = true;
                    }
                }
            }
        }
        for (let c = 1; c <= 9; c++) {
            let set = new Array(9);
            for (let r = 1; r <= 9; r++) {
                let cell = theGrid.cells[r - 1][c - 1];
                if (cell.value != null) {
                    if (set[cell.value - 1]) {
                        message +=
                            "\nCol[" +
                            c +
                            "] has duplicate value " +
                            cell.value;
                    } else {
                        set[cell.value - 1] = true;
                    }
                }
            }
        }
        let count = 0;
        for (let row = 1; row <= 9; row += 3) {
            for (let col = 1; col <= 9; col += 3) {
                let set = new Array(9);
                for (let r = row; r < row + 3; r++) {
                    for (let c = col; c < col + 3; c++) {
                        let cell = theGrid.cells[r - 1][c - 1];
                        if (cell.value != null) {
                            if (set[cell.value - 1]) {
                                message +=
                                    "\nSquare[" +
                                    row +
                                    "," +
                                    col +
                                    "] has duplicate value " +
                                    cell.value;
                            } else {
                                set[cell.value - 1] = true;
                                count++;
                            }
                        }
                    }
                }
            }
        }
        if (count < 17) {
            message +=
                "\nNeed at least 17 values for unique solution, only have " +
                count;
        }
        if (message != "") {
            message = "INVALID PUZZLE" + message;
        }
        return message;
    };

    var getPuzzleText = function () {
        let puzzle = getPuzzle();
        let text = "[";
        for (let row = 1; row < 10; row++) {
            let rowText = puzzle[row - 1].toString().split(",").join("");
            text += '"' + rowText + '"';
            if (row < 9) {
                text += ",<br> ";
            } else {
                text += "]";
            }
        }
        return text;
    };

    var setKiller = function (killerGrid) {
        initGrid(true);
        let retryLocations = [];
        for (var row = 1; row < 10; row++) {
            for (var col = 1; col < 10; col++) {
                let cage = setCell(row, col, killerGrid[row - 1][col - 1]);
                if (cage == null) {
                    retryLocations.push([row, col]);
                }
            }
        }
        while (retryLocations.length > 0) {
            let retry2 = [];
            for (const location of retryLocations) {
                let row = location[0];
                let col = location[1];
                let cage = setCell(row, col, killerGrid[row - 1][col - 1]);
                if (cage == null) {
                    retry2.push([row, col]);
                }
            }
            if (retryLocations.length == retry2.length) {
                // Failed to retry any location, so give up
                return;
            }
            retryLocations = retry2;
        }
    };

    var getKillerGrid = function () {
        let killerGrid = new Array(9);
        for (var row = 1; row < 10; row++) {
            killerGrid[row - 1] = new Array(9);
            for (var col = 1; col < 10; col++) {
                killerGrid[row - 1][col - 1] =
                    theGrid.cells[row - 1][col - 1].value;
            }
        }
        return killerGrid;
    };

    var getKiller = function () {
        let killerGrid = getKillerGrid();
        let killer = gridToKiller(killerGrid);
        return killer;
    };

    var getKillerText = function () {
        let killerGrid = getKillerGrid();
        let text = "[";
        for (let row = 1; row < 10; row++) {
            let rowText = killerGrid[row - 1].toString();
            text += "[" + rowText + "]";
            if (row < 9) {
                text += ",<br> ";
            } else {
                text += "]";
            }
        }
        return text;
    };

    var validateKiller = function () {
        let message = "";
        // all cells must be in a cage
        for (let r = 1; r <= 9; r++) {
            let row = theGrid.cells[r - 1];
            for (let c = 1; c <= 9; c++) {
                let cell = row[c - 1];
                if (cell.cage == undefined || cell.cage == null) {
                    message += "\nCell[" + r + "," + c + "] is not in a cage";
                }
            }
        }
        // total of cages must be 45*9
        let total = 0;
        for (const cage of theGrid.cages) {
            total += cage.total;
        }
        if (total != 45 * 9) {
            message =
                "\nCage total is " + total + ", should be " + 45 * 9 + message;
        }
        if (message != "") {
            message = "INVALID KILLER" + message;
        }
        return message;
    };

    var addCellToKiller = function (killerSpec, r, c, cells) {
        cells.push([r, c]);
        // find next column in this row
        // cage continues with "L"
        if (c + 1 <= 9 && killerSpec[r - 1][c] == "L") {
            addCellToKiller(killerSpec, r, c + 1, cells);
        }
        if (c - 1 >= 1 && killerSpec[r - 1][c - 2] == "R") {
            addCellToKiller(killerSpec, r, c - 1, cells);
        }
        if (r + 1 <= 9 && killerSpec[r][c - 1] == "U") {
            addCellToKiller(killerSpec, r + 1, c, cells);
        }
        if (r - 1 >= 1 && killerSpec[r - 2][c - 1] == "D") {
            addCellToKiller(killerSpec, r + 1, c, cells);
        }
    };

    var gridToKiller = function (killerSpec) {
        let killer = [];
        if (Array.isArray(killerSpec[0])) {
            // construct cages from grid array
            for (let r = 1; r <= 9; r++) {
                let row = killerSpec[r - 1];
                for (let c = 1; c <= 9; c++) {
                    let value = row[c - 1];
                    // new cage starts with a non-zero number
                    if (typeof value == "number" && value != 0) {
                        let total = value;
                        let cells = [];
                        addCellToKiller(killerSpec, r, c, cells);
                        let cage = {
                            total: total,
                            cells: cells,
                        };
                        killer.push(cage);
                    } else if (!["L", "R", "U", "D"].includes(value)) {
                        alert(
                            "Cell[" +
                                r +
                                "," +
                                c +
                                "] has invalid value " +
                                value
                        );
                    }
                }
            }
        } else {
            killer = killerSpec;
        }
        return killer;
    };

    var getSquare = function (irow, icol) {
        var cells = [];
        var row = floor3(irow);
        var col = floor3(icol);
        for (let r = row; r < row + 3; r++) {
            for (let c = col; c < col + 3; c++) {
                cells.push(theGrid.cells[r - 1][c - 1]);
            }
        }
        return cells;
    };

    var getRow = function (row) {
        var r = row;
        var cells = [];
        for (let c = 1; c < 10; c++) {
            cells.push(theGrid.cells[r - 1][c - 1]);
        }
        return cells;
    };

    var getColumn = function (col) {
        var c = col;
        var cells = [];
        for (let r = 1; r < 10; r++) {
            cells.push(theGrid.cells[r - 1][c - 1]);
        }
        return cells;
    };

    var cellsInNonet = function (cells) {
        let cell = cells[0];
        let rowCells = getRow(cell.row);
        if (cells.filter((x) => !rowCells.includes(x)).length == 0) return true;
        let colCells = getColumn(cell.col);
        if (cells.filter((x) => !colCells.includes(x)).length == 0) return true;
        let squareCells = getSquare(cell.row, cell.col);
        if (cells.filter((x) => !squareCells.includes(x)).length == 0)
            return true;
        return false;
    };

    var addVirtualCage = function (cells, source) {
        if (typeof cells == "undefined" || cells == null || cells.length == 0) {
            alert("Cells not valid: " + cells);
        }
        // If cells include whole cages, make a virtual cage for the other cells
        let newLocations = [];
        let cellsTotal = 45 * (cells.length / 9);
        let newTotal = cellsTotal;
        let unionCells = [];
        let otherCagesTotal = 0;
        let otherLocations = [];
        let newCells = [];
        let otherCells = [];
        for (let index = 0; index < cells.length; index++) {
            const cell = cells[index];
            if (!unionCells.includes(cell)) {
                let cage = cell.cage;
                if (
                    typeof cage == "undefined" ||
                    cage == null ||
                    cage.cells.length == 0
                ) {
                    alert("Cage not valid: " + cage);
                }
                let difference = cage.cells.filter((x) => !cells.includes(x));
                if (difference.length > 0) {
                    // Add the cell to the new cage
                    newCells.push(cell);
                    newLocations.push([cell.row, cell.col]);
                    // Add non-included cells from this cell's cage to other cage
                    let firstOtherCellForCage = true;
                    for (const otherCell of difference) {
                        if (!otherCells.includes(otherCell)) {
                            otherCells.push(otherCell);
                            otherLocations.push([otherCell.row, otherCell.col]);
                            if (firstOtherCellForCage) {
                                firstOtherCellForCage = false;
                                otherCagesTotal += cell.cage.total;
                            }
                        }
                    }
                } else {
                    newTotal -= cage.total;
                    unionCells.push(...cage.cells);
                }
            }
        }
        if (newTotal != 0 && newTotal != cellsTotal) {
            // If the cage is in a nonet, then it does not allow duplicates
            const maxCageLength = 5;
            if (newLocations.length <= maxCageLength) {
                let nodups = cellsInNonet(newCells);
                let newCage = new Cage(
                    newTotal,
                    newLocations,
                    true,
                    nodups,
                    source
                );
            }
            if (otherLocations.length <= maxCageLength) {
                let nodups = cellsInNonet(otherCells);
                let otherTotal = otherCagesTotal - newTotal;
                let otherCage = new Cage(
                    otherTotal,
                    otherLocations,
                    true,
                    nodups,
                    source + " x"
                );
            }
        }
    };

    var addVirtualCages = function () {
        for (let size = 1; size <= 5; size++) {
            for (let r = 1; r <= 10 - size; r++) {
                let cells = [];
                for (let r2 = r; r2 < r + size; r2++) {
                    cells.push(...getRow(r2));
                }
                let source =
                    size == 1 ? "row " + r : "rows " + r + "-" + (r + size - 1);
                addVirtualCage(cells, source);
            }
        }
        for (let size = 1; size <= 5; size++) {
            for (let c = 1; c <= 10 - size; c++) {
                let cells = [];
                for (let c2 = c; c2 < c + size; c2++) {
                    cells.push(...getColumn(c2));
                }
                let source =
                    size == 1 ? "col " + c : "cols " + c + "-" + (c + size - 1);
                addVirtualCage(cells, source);
            }
        }
        for (let size = 1; size <= 2; size++) {
            for (let r = 1; r <= 9; r += 3) {
                for (let c = 1; c <= 9; c += 3) {
                    if (size == 1) {
                        let cells = [];
                        cells.push(...getSquare(r, c));
                        let source = "sqr " + r + "," + c;
                        addVirtualCage(cells, source);
                    }
                    if (size == 2) {
                        if (r < 6) {
                            let cells = [];
                            cells.push(...getSquare(r, c));
                            cells.push(...getSquare(r + 3, c));
                            let source =
                                "sqrs " + r + "," + c + "-" + (r + 3) + "," + c;
                            addVirtualCage(cells, source);
                        }
                        if (c < 6) {
                            let cells = [];
                            cells.push(...getSquare(r, c));
                            cells.push(...getSquare(r, c + 3));
                            let source =
                                "sqrs " + r + "," + c + "-" + r + "," + (c + 3);
                            addVirtualCage(cells, source);
                        }
                    }
                }
            }
        }
    };

    var backtrackCount;

    var solveGrid = function () {
        // Copy grid to solution
        let solution = new Array(9);
        for (var row = 1; row < 10; row++) {
            solution[row - 1] = new Array(9);
            for (var col = 1; col < 10; col++) {
                let scell = {
                    cell: theGrid.cells[row - 1][col - 1],
                    value: null,
                };
                solution[row - 1][col - 1] = scell;
                let value = scell.cell.value;
                let cage = scell.cell.cage;
                if (value == undefined || cage != null) value = null;
                scell.value = value;
            }
        }
        // Add virtual cages for killer
        if (killer) {
            addVirtualCages();
        }
        // Get list of solution cells in order of possible values
        let solutionList = [].concat.apply([], solution);
        solutionList.map(
            (scell) =>
                (scell.countPossible = solutionPossibleValues(
                    solution,
                    scell
                ).filter((v) => v).length)
        );
        solutionList.sort((a, b) => {
            if (a.countPossible == b.countPossible) {
                // Prefer element with value set
                if (a.value != null) return -1;
                if (b.value != null) return 1;
            }
            return a.countPossible - b.countPossible;
        });
        // Recursively backtrack over solution list - skip known values at start of list
        let index = solutionList.filter((scell) => scell.value != null).length;
        let t0 = performance.now();
        backtrackCount = 0;
        let solutionCount = backtrack(solution, solutionList, 0);
        let t1 = performance.now();
        console.log(
            "Backtrack took " +
                (t1 - t0) +
                " milliseconds to backtrack " +
                backtrackCount +
                " times"
        );
        return solutionCount;
    };

    var solutionPossibleValues = function (solution, scell) {
        let row = scell.cell.row;
        let col = scell.cell.col;
        let possible = new Array(9);
        if (scell.value == null) {
            possible.fill(true);
            for (let c = 1; c <= 9; c++) {
                let value = solution[row - 1][c - 1].value;
                if (value != null) {
                    possible[value - 1] = false;
                }
            }
            for (let r = 1; r <= 9; r++) {
                let value = solution[r - 1][col - 1].value;
                if (value != null) {
                    possible[value - 1] = false;
                }
            }
            var srow = floor3(row);
            var scol = floor3(col);
            for (let r = srow; r < srow + 3; r++) {
                for (let c = scol; c < scol + 3; c++) {
                    let value = solution[r - 1][c - 1].value;
                    if (value != null) {
                        possible[value - 1] = false;
                    }
                }
            }
            if (killer) {
                for (let cage of theGrid.cells[row - 1][col - 1].cages) {
                    let total = cage.total;
                    let minimum = 1;
                    let count = 0;
                    for (let cell of cage.cells) {
                        let value = solution[cell.row - 1][cell.col - 1].value;
                        if (value != null) {
                            if (cage.nodups) possible[value - 1] = false;
                            total -= value;
                        } else {
                            //if (cell.row != row || cell.col != col) {
                            //    total -= minimum;
                            //    if (cage.nodups) minimum++;
                            //}
                            count++;
                        }
                    }
                    //for (let value = total + 1; value <= 9; value++) {
                    //    possible[value - 1] = false;
                    //}
                    if (cage.nodups) {
                        let cagePossible = cacheTotalPossible(total, count);
                        for (let value = 1; value < 10; value++) {
                            if (!cagePossible[value - 1]) {
                                possible[value - 1] = false;
                            }
                        }
                    }
                }
            }
        } else {
            possible[scell.value - 1] = true;
        }
        return possible;
    };

    var cacheTotalPossible = function (total, length) {
        if (this.cache == undefined) {
            this.cache = new Map();
        }
        let key = "" + total + "," + length;
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        let possible = findTotalPossible(total, length);
        this.cache.set(key, possible);
        return possible;
    };

    var findTotalPossible = function (total, length) {
        let setValues = [];
        let combinations = findTotalCombinations(total, length, setValues);
        // Union the combinations
        let possible = new Array(9);
        for (const combination of combinations) {
            for (const value of combination) {
                possible[value - 1] = true;
            }
        }
        return possible;
    };

    var findTotalCombinations = function (total, length, setValues) {
        let newCombinations = [];
        // Want unique combinations, so start at highest value
        let last = setValues.length == 0 ? 0 : setValues[setValues.length - 1];
        for (let value = last + 1; value < 10; value++) {
            if (!setValues.includes(value)) {
                if (length == 1) {
                    if (total == value) {
                        setValues.push(value);
                        newCombinations.push(setValues);
                        break;
                    }
                } else if (total > value) {
                    // find combinations for reduced total in remaining cells
                    let combinations = findTotalCombinations(
                        total - value,
                        length - 1,
                        setValues.concat(value)
                    );
                    newCombinations.push(...combinations);
                }
            }
        }
        return newCombinations;
    };

    var backtrack = function (solution, solutionList, index) {
        backtrackCount++;

        // Try each possible value of solution[row,col]
        let scell = solutionList[index];
        let startValue = scell.value;
        let solutionCount = 0;
        let impossible = true;
        let possible = solutionPossibleValues(solution, scell);
        for (let value = 1; value <= 9; value++) {
            if (possible[value - 1]) {
                scell.value = value;
                impossible = false;
                if (index + 1 >= solutionList.length) {
                    // Solution!
                    solutionCount++;
                } else {
                    solutionCount += backtrack(
                        solution,
                        solutionList,
                        index + 1
                    );
                }
            }
        }
        if (impossible) {
            impossible = true;
        }
        scell.value = startValue;
        return solutionCount;
    };

    return {
        initGrid: initGrid,
        setCell: setCell,
        removeCell: removeCell,
        getPuzzle: getPuzzle,
        setPuzzle: setPuzzle,
        getKiller: getKiller,
        setKiller: setKiller,
        getPuzzleText: getPuzzleText,
        getKillerText: getKillerText,
        validateKiller: validateKiller,
        validatePuzzle: validatePuzzle,
        solveGrid: solveGrid,
    };
})();
