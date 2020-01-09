
var puzzles = (function() {

    var nextPuzzle = 0;
    var getPuzzle = function () {
        var puzzles = [
            //[ ".........", ".........", ".........", ".........", ".........", ".........", ".........", ".........", "........." ],
            [ ".....123.", "123..8.4.", "8.4..765.", "765......", ".........", "......123", ".123..8.4", ".8.4..765", ".765....." ],
            [ "7...48...", ".5.....24", ".....9..1", ".2.....5.", "3.9.5...6", "...47..3.", "....1..4.", "18....69.", "2..7....." ],
            [ "7......4.", ".....827.", ".4.9.5...", "8.9..3...", "5.3...6.2", "...1..3.8", "...5.7.2.", ".564.....", ".9......3" ],
            [ "...37....", "26.......", ".3.8...47", "9.3..7.1.", ".4.....3.", ".7.9..4.6", "51...2.7.", ".......21", "....18..." ],
            [ "..4.5..2.", "3....97.6", "....78..3", ".15...8..", ".......5.", ".62...3..", "....17..5", "1....64.2", "..3.9..8." ],
            [ "...43....", "..9.2.8..", ".....7.29", ".5....1.3", "..62.57..", "8.1....6.", "14.9.....", "..2.6.9..", "....43..." ],
            [ "....9....", "...2.7..6", "...6.571.", ".2756..4.", "5..3...2.", ".84...6..", "..9..3..5", "..572...3", ".3....268" ],
            [ "...9...21", "....358..", "....1..5.", ".6......9", "..27.43..", "5......1.", ".1..2....", "..615....", "78...6..." ],
            [ "5....39..", "....6....", "..21...75", "7.....34.", "...2.7...", ".86.....7", "97...65..", "....5....", "..58....2" ],
        ];
        if( nextPuzzle >= puzzles.length ) {
            nextPuzzle = 0;
        }
        return puzzles[nextPuzzle++];
    }

    return {
        getPuzzle: getPuzzle
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
                [14, "L", 16, "L", "L", 6, "L", 9, "L"],
                [7, "L", 13, "L", 8, "L", 16, "L", 12],
                [14, 15, 3, "L", 7, 23, "L", "L", "U"],
                ["U", "U", 12, "L", "U", 12, 10, "U", "U"],
                [12, "U", 8, 17, 8, "U", "U", 14, "L"],
                ["U", "L", "U", "U", "U", 14, 4, 13, "L"],
                [5, 17, 13, 6, "U", "U", "U", 12, "U"],
                ["U", "U", "U", "U", 16, 4, 12, "U", 17],
                [6, "L", 10, "L", "U", "U", "U", "U", "U"],
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
    }

    return {
        getKiller: getKiller
    };
})();

var grid = (function () {
    var theGrid;
    var killer = false;

    var getGrid = function () {
        return theGrid;
    }

    var cellId = function (row, col) {
        return "#g" + row + col;
    }

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

        constructor(total, locations) {
            this.total = total;
            this.cells = [];
            // Get cage cells
            locations.forEach(element => {
                let cell = Cage.theGrid.cells[element[0] - 1][element[1] - 1];
                this.cells.push(cell);
            });
            // Set cage for cells
            this.cells.forEach(cell => {
                cell.cage = this;
                if( cell === this.cells[0]) {
                    cell.value = total;
                }
            });
            // Add cage to the grid display
            if (Cage.theGrid.cages == null) {
                Cage.theGrid.cages = [this];
            } else {
                Cage.theGrid.cages.push(this);
            }
        }

        remove() {
            this.cells.forEach(cell => {
                cell.cage = null;
                cell.value = null;
            });
            Cage.theGrid.cages = Cage.theGrid.cages.filter(x => x != this);
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
            if (cell.value != value) {
                cell.value = value;
                displayCell(cell);
            }
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
                adjacentCells = adjacentCells.filter(n => !cage.cells.includes(n));
                let adjacentCages = adjacentCells.map(x => x.cage);
                adjacentCages = adjacentCages.filter(c => c != undefined);
                let adjacentColours = adjacentCages.map(c => c.colour);
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
            if (["D","L","R","U"].includes(entry)) {
                // Get cage from referenced cell
                let r = row;
                let c = col;
                if (entry == "D") r++;
                if (entry == "L") c--;
                if (entry == "R") c++;
                if (entry == "U") r--;
                if (r >=1 && r <= 9 && c >= 1 && c <= 9) {
                    cage = this.cells[r - 1][c - 1].cage;
                    if (cage != undefined) {
                        let cell = this.cells[row - 1][col - 1];
                        cage.cells.push(cell);
                        cell.cage = cage;
                        cell.value = entry;
                        displayCell(cell);
                    }
                }
            } else {
                let value = Number(entry);
                let cell = this.cells[row - 1][col - 1];
                cage = cell.cage;
                if (cage === undefined || cage == null) {
                    cage = new Cage(value, [[row,col]]);
                    displayCell(cell);
                } else if (cage.cells[0] === cell) {
                    // Can only update first cell of cage
                    let newTotal = cage.total*10 + value;
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
                for (const cell of cells) {
                    var id = cellId(cell.row, cell.col);
                    $("id").removeClass("td.c1");
                    $("id").removeClass("td.c2");
                    $("id").removeClass("td.c3");
                    $("id").removeClass("td.c4");
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
                html = '<div class="cage">' + cell.cage.total + '</div>';
            }
            else {
                html = '<div class="cage">' + cell.value + '</div>';
            }
        } else {
            if (cell.value == null) {
                var text = "";
                html += '<div class="possible">' + text + '</div>';
            }
            else {
                html += '<div class="known">' + cell.value + '</div>';
            }
        }
        $(id).html(html);
        // If killer then colour cell
        if (cell.cage != undefined) {
            let colour = cell.cage.colour;
            $("id").removeClass("c1");
            $("id").removeClass("c2");
            $("id").removeClass("c3");
            $("id").removeClass("c4");
            if (colour != undefined) {
                let colourClass = "c" + colour;
                $(id).addClass(colourClass);
            }
        }
    }

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
    }

    var removeCell = function (row, col) {

        if (!killer) {
            theGrid.clearCell(row, col);
        } else {
            // Cage value
            theGrid.removeCage(row, col);
        }

        displayCell(theGrid.cells[row - 1][col - 1]);
    }

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
    }

    var getPuzzle = function () {
        let puzzle = new Array(9);
        for (let row = 1; row < 10; row++) {
            puzzle[row-1] = new Array(9);
            for (let col = 1; col < 10; col++) {
                let entry = theGrid.cells[row - 1][col - 1].value;
                if (entry == null) entry = ".";
                puzzle[row - 1][col - 1] = entry;
            }
        }
        return puzzle;
    }

    var getPuzzleText = function () {
        let puzzle = getPuzzle();
        let text = "[";
        for (let row = 1; row < 10; row++) {
            let rowText = puzzle[row - 1].toString().split(",").join("");
            text += '"' + rowText + '"';
            if( row < 9) {
                text += ",<br> ";
            } else {
                text += "]";
            }
        }
        return text;
    }

    var setKiller = function(killerGrid) {
        initGrid(true);
        let retryLocations = [];
        for (var row = 1; row < 10; row++) {
            for (var col = 1; col < 10; col++) {
                let cage = setCell(row, col, killerGrid[row-1][col-1]);
                if (cage == null) {
                    retryLocations.push([row,col]);
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
    }

    var getKillerGrid = function () {
        let killerGrid = new Array(9);
        for (var row = 1; row < 10; row++) {
            killerGrid[row - 1] = new Array(9);
            for (var col = 1; col < 10; col++) {
                killerGrid[row - 1][col - 1] = theGrid.cells[row - 1][col - 1].value;
            }
        }
        return killerGrid;
    }

    var getKiller = function () {
        let killerGrid = getKillerGrid();
        let killer = gridToKiller(killerGrid);
        return killer;
    }

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
    }

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
    }

    var gridToKiller = function (killerSpec) {
        let killer = [];
        if (Array.isArray(killerSpec[0])) {
            // construct cages from grid array
            for (let r = 1; r <= 9; r++) {
                let row = killerSpec[r - 1];
                for (let c = 1; c <= 9; c++) {
                    let value = row[c - 1];
                    // new cage starts with a non-zero number
                    if (typeof (value) == "number" && value != 0) {
                        let total = value;
                        let cells = [];
                        addCellToKiller(killerSpec, r, c, cells);
                        let cage = {
                            total: total,
                            cells: cells
                        }
                        killer.push(cage);
                    } else if (!["L", "R", "U", "D"].includes(value)) {
                        alert("Cell[" + r + "," + c + "] has invalid value " + value);
                    }
                }
            }
        } else {
            killer = killerSpec;
        }
        return killer;
    }


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
    };
})();
