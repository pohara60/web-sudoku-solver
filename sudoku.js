var sudoku = (function sudoku() {
    var debug = false;
    var updateControl = null;
    var theGrid;
    var updateCount;
    var clearFormatting, clearColours, showMessages;

    var getGrid = function () {
        return theGrid;
    };

    /**
     * Represents the Sudoku grid
     * Maintains a list of updatedCells to be processed,
     * and a count of unknownCells
     */
    class Grid {
        constructor() {
            this.cells = new Array(9);
            for (var row = 1; row < 10; row++) {
                this.cells[row - 1] = new Array(9);
                for (var col = 1; col < 10; col++) {
                    this.cells[row - 1][col - 1] = new Cell(row, col);
                }
            }
            this.updatedCells = new Array(0);
            this.unknownCells = 81;
        }

        /**
         * Add updated cell to updatedCells
         * @param {Cell} cell - the updated cell
         * @param {Boolean} manual - manual (user) update
         */
        addUpdatedCell(cell, manual = false) {
            let index = this.updatedCells.indexOf(cell);
            if (manual) {
                // For manual updates ensure the cell is at start of update list
                if (index != -1) {
                    this.updatedCells.splice(index, 1);
                }
                this.updatedCells.unshift(cell);
            } else {
                // For automatic updates ensure the cell is in the update list
                if (index == -1) {
                    this.updatedCells.push(cell);
                }
            }
        }

        /**
         * Set cell value, add to updatedCells if updated
         * @param {number} row - cell row 1..9
         * @param {number} col  - cell column 1..9
         * @param {number} entry - cell value 1..9
         * @param {boolean} manual - manual (user) update
         * @returns {boolean} - the cell was updated
         */
        setCell(row, col, entry, manual = false) {
            var cell = this.cells[row - 1][col - 1];
            var value = entry; // Not Number(entry) because allow null
            if (cell.value != value) {
                cell.value = value;
                this.addUpdatedCell(cell, manual);
                return true;
            }
            return false;
        }

        /**
         * Take next cell from updatedCells
         * @returns {Cell} - the cell
         */
        nextUpdate() {
            if (this.unknownCells === 0) return undefined;

            var cell = this.updatedCells.shift();
            return cell;
        }

        /**
         * Remove possible value from cell, add to updatedCells if updated
         * @param {Cell} cell - the cell
         * @param {number} entry - possible value to remove
         * @returns {boolean} - the cell was updated
         */
        removeCell(cell, entry) {
            if (cell.remove(entry)) {
                this.addUpdatedCell(cell);
                return true;
            } else {
                return false;
            }
        }

        /**
         * Remove array of possible values from cell, add to updatedCells if updated
         * @param {Cell} cell - the cell
         * @param {Array} p - possible values to remove
         * @returns {boolean} - the cell was updated
         */
        removeCellList(cell, p) {
            if (cell.removeList(p)) {
                this.addUpdatedCell(cell);
                return true;
            } else {
                return false;
            }
        }

        /**
         * Toggle a possible value for cell, add to updatedCells if updated
         * @param {Cell} cell - the cell
         * @param {number} entry - the possible value to toggle
         * @param {boolean} manual - manual (user) update
         * @returns {boolean} - the cell was updated
         */
        toggle(cell, entry, manual = false) {
            if (cell.toggle(entry)) {
                this.addUpdatedCell(cell, manual);
                return true;
            } else {
                return false;
            }
        }

        /**
         * Return up to 4 cells adjacent to cell
         * @param {Cell} cell - the cell
         * @returns {Array} - the cells
         */
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
    }

    /**
     * Initialize the Sudoku grid
     * @param {function} updateCtl - function to update the display with the update count
     * @param {boolean} dbg - debug
     * @param {function} clrFormatting - function to clear formatting of the grid
     * @param {function} clrColours - function to clear colours of the grid
     * @param {function} shwMessages - function to show explanation messages
     */
    var initGrid = function (
        updateCtl,
        dbg,
        clrFormatting,
        clrColours,
        shwMessages
    ) {
        debug = dbg;
        updateControl = updateCtl;

        theGrid = new Grid();

        clearFormatting = clrFormatting;
        clearColours = clrColours;
        showMessages = shwMessages;
    };

    /**
     * Update display for a cell
     * May show killer cage total
     * May show cell value if known
     * May show possible values
     * Colours killer cages
     * @param {Cell} cell
     */
    var displayCell = function (cell) {
        var id = cellId(cell.row, cell.col);
        var html = "";
        // If killer then add cage value
        if (cell.cage != undefined) {
            if (cell.cage.cells[0] == cell) {
                html = '<div class="cage">' + cell.cage.total + "</div>";
            } else {
                html = '<div class="cage">&nbsp;</div>';
            }
        }
        if (cell.value == null) {
            var text = "";
            if (cell.possible != null) {
                // Show possibles
                for (let entry = 1; entry < 10; entry++) {
                    if (cell.possible[entry - 1]) {
                        text = text + entry;
                    } else {
                        text = text + "&nbsp;";
                    }
                    if (entry === 3 || entry === 6) {
                        text = text + "<br>";
                    }
                }
            }
            html += '<div class="possible">' + text + "</div>";
        } else {
            html += '<div class="known">' + cell.value + "</div>";
        }
        $(id).html(html);
        // If killer then colour cell
        if (cell.cage != undefined) {
            let colour = cell.cage.colour;
            if (colour != undefined) {
                let colourClass = "c" + colour;
                $(id).addClass(colourClass);
            }
        }
    };

    /**
     * UI function: Set cell value
     * Removes value from other connected cells (row, column, nonet)
     * Display cell and any other updated cells
     * @param {number} row - the cell row 1..9
     * @param {number} col - the cell column 1..9
     * @param {number} entry - the cell value 1..9
     * @param {boolean} manual - manual (user) update
     */
    var setCell = function (row, col, entry, manual = false) {
        let union = { updates: [], errors: [], messages: [] };
        let cell = theGrid.cells[row - 1][col - 1];
        if (entry != ".") {
            if (cell.value != null && entry == null) {
                // Add the cell value to possible of linked cells
                union = addOtherPossible(cell, "User cleared " + cell);
            }
            if (theGrid.setCell(row, col, entry, manual)) {
                union.updates.push(cell);
                union.messages.push(
                    "User Set cell[" + row + "," + col + "] = " + cell.value
                );
            }
        }

        displayCellList(cell, union);
    };

    /**
     * UI function: Toggle possible value for cell
     * Display updated cell
     * @param {number} row - the cell row 1..9
     * @param {number} col - the cell column 1..9
     * @param {number} entry - the cell value 1..9
     * @param {boolean} manual - manual (user) update
     */
    var toggle = function (row, col, entry, manual = false) {
        let cell = theGrid.cells[row - 1][col - 1];
        if (theGrid.toggle(cell, entry, manual)) {
            displayCell(cell);
        }
    };

    /**
     * Initialise display
     */
    var initDisplay = function () {
        updateCount = 0;
        $(updateControl).attr("value", updateCount);
        clearFormatting();
        clearColours();
        showMessages(null);
    };

    /**
     * Set cells in grid from Sudoku puzzle array
     * @param {Array} puzzle - Sudoku puzzle with array or strings for each row, e.g. "5....39.."
     */
    var initPuzzle = function (puzzle) {
        for (var row = 1; row < 10; row++) {
            for (var col = 1; col < 10; col++) {
                var entry = puzzle[row - 1][col - 1];
                setCell(row, col, entry);
            }
        }

        initDisplay();
    };

    /**
     * Return HTML id for cell
     * @param {number} row - the cell row 1..9
     * @param {number} col - the cell column 1..9
     * @returns {String} HTML id string
     */
    var cellId = function (row, col) {
        return "#g" + row + col;
    };

    /**
     * Return the union of the possible values in array of cells
     * @param {Array} cells - array of cells
     * @returns {Array} possible values
     */
    var unionPossible = function (cells) {
        var result = new Array(9);
        for (let index = 0; index < cells.length; index++) {
            cells[index].initPossible();
        }
        for (let entry = 1; entry < 10; entry++) {
            result[entry - 1] = false;
            for (let index = 0; index < cells.length; index++) {
                if (cells[index].possible[entry - 1]) {
                    result[entry - 1] = true;
                    break;
                }
            }
        }
        return result;
    };

    /**
     * Return count of possible values
     * @param {Array} possible - array of possible values
     * @returns {number} count of possible values
     */
    var countPossible = function (possible) {
        var count = 0;
        for (let index = 0; index < 10; index++) {
            if (possible[index]) {
                count++;
            }
        }
        return count;
    };

    /**
     * Negate possible values
     * @param {Array} p1 - array of possible values
     * @returns {Array} inverse possible values
     */
    var notPossible = function (p1) {
        var possible = [];
        for (let index = 0; index < 9; index++) {
            possible[index] = !p1[index];
        }
        return possible;
    };

    /**
     * Return the intersection of two arrays of possible values
     * @param {Array} p1 - possible values
     * @param {Array} p2 - possible values
     * @returns {number} count of possible values
     */
    var intersectPossible = function (p1, p2) {
        var count = 0;
        for (let index = 0; index < 10; index++) {
            if (p1[index] && p2[index]) {
                count++;
            }
        }
        return count;
    };

    /**
     * Return the subtraction of two arrays of possible values
     * @param {Array} p1 - possible values
     * @param {Array} p2 - possible values to subtract
     * @returns {Array} possible values
     */
    var subtractPossible = function (p1, p2) {
        var possible = [];
        for (let index = 0; index < 9; index++) {
            if (p1[index] && !p2[index]) {
                possible[index] = true;
            } else {
                possible[index] = false;
            }
        }
        return possible;
    };

    /**
     * Recursive function to compute Groups (Pairs, Triples, etc) of possible values
     * @param {Array} pC - array of cells to check
     * @param {number} g - required group size
     * @param {Array} sC - current cells in group
     * @param {number} f - next index in check cells to try
     * @param {Array} array of groups, each of which is an array of cells
     */
    var findGroups = function (pC, g, sC, f) {
        var groups = [];
        for (let index = f; index < pC.length; index++) {
            var c = pC[index];
            c.initPossible();
            if (!sC.includes(c) && countPossible(c.possible) <= g) {
                var newSC = sC.concat(c);
                var possible = unionPossible(newSC);
                if (countPossible(possible) <= g) {
                    if (newSC.length === g) {
                        groups.push(newSC);
                    } else {
                        // try adding cells to group
                        var newGroups = findGroups(pC, g, newSC, index + 1);
                        if (newGroups.length > 0) {
                            groups = groups.concat(newGroups);
                        }
                    }
                }
            }
        }
        return groups;
    };

    /**
     * Find possible combinations of values for cage, remove impossible values
     * @param {Cage} cage - the cage to update
     * @param {String} explanation - explanation string
     * @returns {Object} updated cells, errors, messages
     */
    var updateCage = function (cage, explanation) {
        let updatedCells = [];
        let messages = [];
        explanation =
            (explanation != "" ? explanation + ", " : "") +
            "update cage " +
            cage;
        let start = 0;
        let total = cage.total;
        let setValues = [];
        let combinations = cage.findCageCombinations(0, total, setValues);
        // Update possible values to union of combinations
        let unionCombinations = new Array(cage.cells.length);
        for (let index = 0; index < cage.cells.length; index++) {
            unionCombinations[index] = [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
            ];
        }
        for (const combination of combinations) {
            for (let index = 0; index < combination.length; index++) {
                const value = combination[index];
                unionCombinations[index][value - 1] = true;
            }
        }
        for (let index = 0; index < cage.cells.length; index++) {
            let cell = cage.cells[index];
            let notUnion = notPossible(unionCombinations[index]);
            if (theGrid.removeCellList(cell, notUnion)) {
                if (!updatedCells.includes(cell)) {
                    updatedCells.push(cell);
                }
                messages.push(
                    (explanation != "" ? explanation + ", " : "") +
                        "remove possible " +
                        notUnion.map((v, i) => (!v ? "" : i + 1)).join("") +
                        " from " +
                        cell
                );
            }
        }
        return {
            updates: updatedCells,
            errors: [],
            messages: messages,
        };
    };

    var createTestCell = function (poss) {
        var cell = new Cell(1, 1);
        for (let entry = 0; entry < 10; entry++) {
            var found = false;
            for (let index = 0; index < poss.length; index++) {
                if (poss[index] === entry) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                cell.remove(entry);
            }
        }
        return cell;
    };
    var testFindGroups = function () {
        var pC = [
            createTestCell([1, 2]),
            createTestCell([3, 4]),
            createTestCell([1, 2]),
            createTestCell([4, 5]),
            createTestCell([3, 5]),
            createTestCell([6, 7]),
            createTestCell([2, 3, 8, 9]),
            createTestCell([6, 7]),
        ];
        for (let gl = 2; gl < 4; gl++) {
            var groups = findGroups(pC, gl, [], 0);
            for (let gi = 0; gi < groups.length; gi++) {
                var g = groups[gi];
                var text = gl + "Group " + gi + ":";
                var possible = unionPossible(g);
                for (let i = 0; i < 10; i++) {
                    if (possible[i]) {
                        text = text + " " + (i + 1);
                    }
                }
                console.log(text);
            }
        }
    };

    /**
     * Find unknown cells in an array of cells
     * @param {Array} cells - cells to examine
     * @returns {Array} unknown cells
     */
    var unknownCells = function (cells) {
        var possibleCells = [];
        for (let index = 0; index < cells.length; index++) {
            var c = cells[index];
            if (c.value == null) {
                possibleCells.push(c);
            }
        }
        return possibleCells;
    };

    /**
     * Check for duplicate or impossible values in nine cells
     * @param {Cell} cell - current cell
     * @param {Array} cells - nine cells to check
     * @returns {Array} error cells
     */
    var checkCellList = function (cell, cells) {
        var errors = [];
        for (let entry = 1; entry < 10; entry++) {
            var knownCells = [];
            var possible = 0;
            for (let index = 0; index < cells.length; index++) {
                var c = cells[index];
                c.initPossible();
                if (c.value == entry) {
                    if (knownCells.length > 0) {
                        console.log(
                            "Duplicate cell entry for cell[" +
                                cell.row +
                                "," +
                                cell.col +
                                "]"
                        );
                        knownCells.push(c);
                    } else {
                        knownCells.push(c);
                    }
                } else if (c.possible[entry - 1]) {
                    possible++;
                }
            }
            if (knownCells == null) {
                if (possible == 0) {
                    console.log(
                        "Impossible entry for cell[" +
                            cell.row +
                            "," +
                            cell.col +
                            "]"
                    );
                    errors = cells;
                    break;
                }
            } else if (knownCells.length > 1) {
                for (let i = 0; i < knownCells.length; i++) {
                    if (!errors.includes(knownCells[i])) {
                        errors.push(knownCells[i]);
                    }
                }
            }
        }
        return errors;
    };

    /**
     * Update nonet of cells for (updated) cell
     * May set other cells
     * Optionally check rows and/or columns of nonet for unique values and
     * remove these from the rest of the row or column
     * Checks resulting nonet for errors (should not happen!)
     * @param {Cell} cell - current cell
     * @param {Array} cells - nonet cells to check, may be square, row or column
     * @param {boolean} checkRow - check rows?
     * @param {boolean} checkCol - check columns?
     * @param {String} explanation - explanation text
     * @returns {Object} updated cells, errors, messages
     */
    var updateCellList = function (
        cell,
        cells,
        checkRow,
        checkCol,
        explanation
    ) {
        var updatedCells = [];
        var messages = [];
        if (!(cell.value == null)) {
            // Remove known value from other cells
            for (let index = 0; index < cells.length; index++) {
                var c = cells[index];
                if (!(c === cell)) {
                    if (theGrid.removeCell(c, cell.value)) {
                        if (!updatedCells.includes(c)) {
                            updatedCells.push(c);
                        }
                        messages.push(
                            (explanation != "" ? explanation + ", " : "") +
                                "remove value " +
                                cell.value +
                                " from " +
                                c
                        );
                    }
                }
            }
        }

        // Check cells for groups
        // Number of possible values is 9 less number known cells
        var possibleCells = unknownCells(cells);
        var numPossible = possibleCells.length;

        // Check for groups of 2 to numPossible-1 cells
        var update = true;
        while (update) {
            update = false;
            for (let gl = 2; gl < numPossible; gl++) {
                var groups = findGroups(possibleCells, gl, [], 0);
                for (let gi = 0; gi < groups.length; gi++) {
                    var group = groups[gi];
                    var possible = unionPossible(group);
                    // Remove group from other cells
                    for (let i = 0; i < possibleCells.length; i++) {
                        var c = possibleCells[i];
                        if (!group.includes(c)) {
                            if (theGrid.removeCellList(c, possible)) {
                                update = true;
                                if (!updatedCells.includes(c)) {
                                    updatedCells.push(c);
                                }
                                messages.push(
                                    (explanation != ""
                                        ? explanation + ", "
                                        : "") +
                                        "remove group " +
                                        possible
                                            .map((v, i) => (!v ? "" : i + 1))
                                            .join("") +
                                        " from " +
                                        c
                                );
                            }
                        }
                    }
                }
            }
        }

        // Check for rows or columns that must contain entry, clear from rest of row or column
        if (checkRow) {
            for (let row = 0; row < 3; row++) {
                var cells3 = [];
                for (let col = 0; col < 3; col++) {
                    cells3.push(cells[row * 3 + col]);
                }
                var cells6 = cells.slice();
                for (let i = 0; i < cells3.length; i++) {
                    var index = cells6.indexOf(cells3[i]);
                    cells6.splice(index, 1);
                }
                var possible3 = unionPossible(cells3);
                var possible6 = unionPossible(cells6);
                var unique3 = subtractPossible(possible3, possible6);
                if (countPossible(unique3) > 0) {
                    // The unique3 possible values can be removed from the row
                    var r = cells3[0].row;
                    for (let c = 1; c < 10; c++) {
                        var cell = theGrid.cells[r - 1][c - 1];
                        if (cell.value == null && !cells3.includes(cell)) {
                            if (theGrid.removeCellList(cell, unique3)) {
                                if (!updatedCells.includes(cell)) {
                                    updatedCells.push(cell);
                                }
                                messages.push(
                                    (explanation != ""
                                        ? explanation + ", "
                                        : "") +
                                        "remove unique " +
                                        unique3
                                            .map((v, i) => (!v ? "" : i + 1))
                                            .join("") +
                                        " from " +
                                        cell
                                );
                            }
                        }
                    }
                }
            }
        }
        if (checkCol) {
            for (let col = 0; col < 3; col++) {
                var cells3 = [];
                for (let row = 0; row < 3; row++) {
                    cells3.push(cells[row * 3 + col]);
                }
                var cells6 = cells.slice();
                for (let i = 0; i < cells3.length; i++) {
                    var index = cells6.indexOf(cells3[i]);
                    cells6.splice(index, 1);
                }
                var possible3 = unionPossible(cells3);
                var possible6 = unionPossible(cells6);
                var unique3 = subtractPossible(possible3, possible6);
                if (countPossible(unique3) > 0) {
                    // The unique3 possible values can be removed from the col
                    var c = cells3[0].col;
                    for (let r = 1; r < 10; r++) {
                        var cell = theGrid.cells[r - 1][c - 1];
                        if (cell.value == null && !cells3.includes(cell)) {
                            if (theGrid.removeCellList(cell, unique3)) {
                                if (!updatedCells.includes(cell)) {
                                    updatedCells.push(cell);
                                }
                                messages.push(
                                    (explanation != ""
                                        ? explanation + ", "
                                        : "") +
                                        "remove unique " +
                                        unique3
                                            .map((v, i) => (!v ? "" : i + 1))
                                            .join("") +
                                        " from " +
                                        cell
                                );
                            }
                        }
                    }
                }
            }
        }

        var errors = checkCellList(cell, cells);

        return {
            updates: updatedCells,
            errors: errors,
            messages: messages,
        };
    };

    /**
     * Return cells in square that includes co-ordinates
     * @param {number} irow - row 1..9
     * @param {number} icol - column 1..9
     * @returns {Array} square cells
     */
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

    /**
     * Update square that includes (updated) cell
     * @param {Cell} cell - the cell
     * @param {String} explanation - explanation text
     * @returns {Object} updated cells, errors, messages
     */
    var updateCellSquare = function (cell, explanation) {
        var cells = getSquare(cell.row, cell.col);
        return updateCellList(
            cell,
            cells,
            true,
            true,
            (explanation != "" ? explanation + ", " : "") +
                cells[0].location("square")
        );
    };

    /**
     * Return cells in row
     * @param {number} row - row 1..9
     * @returns {Array} row cells
     */
    var getRow = function (row) {
        var r = row;
        var cells = [];
        for (let c = 1; c < 10; c++) {
            cells.push(theGrid.cells[r - 1][c - 1]);
        }
        return cells;
    };

    /**
     * Update row that includes (updated) cell
     * @param {Cell} cell - the cell
     * @param {String} explanation - explanation text
     * @returns {Object} updated cells, errors, messages
     */
    var updateCellRow = function (cell, explanation) {
        var cells = getRow(cell.row);
        return updateCellList(
            cell,
            cells,
            true,
            false,
            (explanation != "" ? explanation + ", " : "") +
                cells[0].location("row")
        );
    };

    /**
     * Return cells in column
     * @param {number} col - column 1..9
     * @returns {Array} square cells
     */
    var getColumn = function (col) {
        var c = col;
        var cells = [];
        for (let r = 1; r < 10; r++) {
            cells.push(theGrid.cells[r - 1][c - 1]);
        }
        return cells;
    };

    /**
     * Update column that includes (updated) cell
     * @param {Cell} cell - the cell
     * @param {String} explanation - explanation text
     * @returns {Object} updated cells, errors, messages
     */
    var updateCellColumn = function (cell, explanation) {
        var cells = getColumn(cell.col);
        return updateCellList(
            cell,
            cells,
            false,
            true,
            (explanation != "" ? explanation + ", " : "") +
                cells[0].location("column")
        );
    };

    /**
     * Check if an array of cells comprises a nonet (square, row or column)
     * @param {Array} cells - array of cells
     * @returns {boolean} cells is a nonet
     */
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

    /**
     * Return union of updated cells, errors, messages
     * @param {Object} union - updated cells, errors, messages
     * @param {Object} updates - updated cells, errors, messages
     * @returns {Object} union of updated cells, errors, messages
     */
    var unionUpdates = function (union, updates) {
        if (union == null) {
            union = {
                updates: [],
                errors: [],
                messages: [],
            };
        }
        return {
            updates: union.updates.concat(updates.updates),
            errors: union.errors.concat(updates.errors),
            messages: union.messages.concat(updates.messages),
        };
    };

    /**
     * Highlight current cell, and affected cells
     * @param {Cell} cell - current cell
     * @param {Object} union - updated cells, errors, messages
     */
    var displayCellList = function (cell, union) {
        // Format update
        let id = cellId(cell.row, cell.col);
        $(id).addClass("highlight");
        for (let index = 0; index < union.updates.length; index++) {
            let cell2 = union.updates[index];
            let id = cellId(cell2.row, cell2.col);
            if (cell2 === cell) {
                $(id).removeClass("highlight");
                $(id).addClass("updated");
            } else {
                $(id).addClass("affected");
            }
            displayCell(cell2);
        }
        for (let index = 0; index < union.errors.length; index++) {
            cell = union.errors[index];
            id = cellId(cell.row, cell.col);
            $(id).addClass("error");
            displayCell(cell);
        }
        showMessages(union.messages);
    };

    /**
     * UI function: Update cell and display results
     * The cell may have already been set by other updates, or its
     * possible values may be impacted other updates in its nonets
     * Then check the cell's nonets and cages to propagate updates
     * Display updated cells
     * Update the UI update count
     * @param {Cell} cell - current cell
     * @returns {boolean} indicate if update successful
     */
    var updateCell = function (cell) {
        clearFormatting();

        //var explanation = "Update " + cell.location("cell");
        var explanation = ""; // Do not need this text because visible in UI
        var update = false;
        var union = { updates: [], errors: [], messages: [] };
        if (cell.value == null) {
            // Possible values may have changed due to other updates
            union = unionUpdates(union, updatePossible(cell, explanation));
        }

        union = unionUpdates(union, updateCellSquare(cell, explanation));
        union = unionUpdates(union, updateCellRow(cell, explanation));
        union = unionUpdates(union, updateCellColumn(cell, explanation));

        // If killer then update cage
        if (cell.cage) {
            for (let cage of cell.cages) {
                union = unionUpdates(union, updateCage(cage, explanation));
            }
        }

        // Format update
        displayCellList(cell, union);

        updateCount++;
        $(updateControl).attr("value", updateCount);

        if (union.errors.length > 0) return undefined;

        return true;
    };

    /**
     * Update cell possible values for nonet values
     * @param {Cell} cell - current cell
     * @param {Array} cells - nonet cells
     * @param {String} explanation - label for messages
     * @returns {Object} updated cells, errors, messages
     */
    var updatePossibleList = function (cell, cells, explanation) {
        var errors = [];
        var messages = [];
        var update = false;
        var values = new Array(9);
        for (const c of cells) {
            if (c != cell) {
                var value = c.value;
                if (value != null) {
                    if (cell.remove(value)) {
                        update = true;
                        messages.push(
                            (explanation != "" ? explanation + ", " : "") +
                                "update possible cell" +
                                cell
                        );
                    }
                    if (values[value - 1]) {
                        errors.push(c);
                        messages.push(
                            (explanation != "" ? explanation + ", " : "") +
                                "duplicate value " +
                                value
                        );
                    } else {
                        values[value - 1] = true;
                    }
                }
            }
        }
        return {
            updates: update ? [cell] : [],
            errors: errors,
            messages: messages,
        };
    };

    /**
     * Update cell possible values for square, row and column
     * @param {Cell} cell - current cell
     * @param {String} explanation - label for explanation messages
     * @returns {Object} updated cells, errors, messages
     */
    var updatePossible = function (cell, explanation) {
        cell.initPossible();

        // Remove known values from square, row, col
        let union = { updates: [], errors: [], messages: [] };
        let cells = getSquare(cell.row, cell.col);
        let location =
            (explanation != "" ? explanation + ", " : "") +
            cells[0].location("square");
        union = unionUpdates(union, updatePossibleList(cell, cells, location));

        cells = getRow(cell.row);
        location =
            (explanation != "" ? explanation + ", " : "") +
            cells[0].location("row");
        union = unionUpdates(union, updatePossibleList(cell, cells, location));

        cells = getColumn(cell.col);
        location =
            (explanation != "" ? explanation + ", " : "") +
            cells[0].location("column");
        union = unionUpdates(union, updatePossibleList(cell, cells, location));

        if (debug) console.log("updatePossible: " + cell.toString());
        return union;
    };

    /**
     * Update nonet possible values for cell
     * @param {Cell} cell - current cell
     * @param {Array} cells - nonet cells
     * @param {String} location - label for error messages
     * @returns {Object} updated cells, errors, messages
     */
    var updateOtherPossibleList = function (cell, cells, location) {
        var updates = [];
        var errors = [];
        var messages = [];
        var values = new Array(9);
        values[cell.value - 1] = true;
        for (const c of cells) {
            if (c != cell) {
                var value = c.value;
                if (value != null) {
                    if (values[value - 1]) {
                        errors.push(c);
                        messages.push(location + ", duplicate value " + value);
                    } else {
                        values[value - 1] = true;
                    }
                } else {
                    if (c.remove(cell.value)) {
                        updates.push(c);
                        messages.push(
                            location +
                                ", remove value " +
                                cell.value +
                                " from " +
                                c
                        );
                    }
                }
            }
        }
        return { updates: updates, errors: errors, messages: messages };
    };

    /**
     * Update square, row and column possible values for cell
     * @param {Cell} cell - current cell
     * @param {String} explanation - explanation string
     * @returns {Object} updated cells, errors, messages
     */
    var cellUpdateOtherPossible = function (cell, explanation) {
        // Only done for known cells
        let union = { updates: [], errors: [], messages: [] };
        if (cell.value == null) return union;

        // Remove known value from square, row, col
        let cells = getSquare(cell.row, cell.col);
        let location =
            (explanation != "" ? explanation + ", " : "") +
            cells[0].location("square");
        union = unionUpdates(
            union,
            updateOtherPossibleList(cell, cells, location)
        );

        cells = getRow(cell.row);
        location =
            (explanation != "" ? explanation + ", " : "") +
            cells[0].location("row");
        union = unionUpdates(
            union,
            updateOtherPossibleList(cell, cells, location)
        );

        cells = getColumn(cell.col);
        location =
            (explanation != "" ? explanation + ", " : "") +
            cells[0].location("column");
        union = unionUpdates(
            union,
            updateOtherPossibleList(cell, cells, location)
        );

        if (debug) console.log("cellUpdateOtherPossible: " + cell.toString());
        return union;
    };

    /**
     * Add cell value to nonet possible values (before removing cell value)
     * @param {Cell} cell - current cell
     * @param {Array} cells - nonet cells
     * @param {String} location - label for error messages
     * @returns {Object} updated cells, errors, messages
     */
    var addOtherPossibleList = function (cell, cells, location) {
        var updates = [];
        var errors = [];
        var messages = [];
        var values = new Array(9);
        // If cell value not known in other cells, add it to possible
        if (!values[cell.value - 1]) {
            for (const c of cells) {
                if (c != cell) {
                    var value = c.value;
                    if (value == null) {
                        if (c.add(cell.value)) {
                            updates.push(c);
                            messages.push(
                                location +
                                    ", Add possible " +
                                    value +
                                    " to " +
                                    c
                            );
                        }
                    }
                }
            }
        }
        return { updates: updates, errors: errors, messages: messages };
    };

    /**
     * Add cell value to square, row, column possible values (before removing cell value)
     * @param {Cell} cell - current cell
     * @param {String} explanation - explanation for messages
     * @returns {Object} updated cells, errors, messages
     */
    var addOtherPossible = function (cell, explanation) {
        // Only done for known cells
        let union = { updates: [], errors: [], messages: [] };
        if (cell.value == null) return union;

        // Remove known value from square, row, col
        let cells = getSquare(cell.row, cell.col);
        let location =
            (explanation != "" ? explanation + ", " : "") +
            cells[0].location("square");
        union = unionUpdates(
            union,
            addOtherPossibleList(cell, cells, location)
        );

        cells = getRow(cell.row);
        location =
            (explanation != "" ? explanation + ", " : "") +
            cells[0].location("row");
        union = unionUpdates(
            union,
            addOtherPossibleList(cell, cells, location)
        );

        cells = getColumn(cell.col);
        location =
            (explanation != "" ? explanation + ", " : "") +
            cells[0].location("column");
        union = unionUpdates(
            union,
            addOtherPossibleList(cell, cells, location)
        );

        if (debug) console.log("addOtherPossible: " + cell.toString());
        return union;
    };

    /**
     * UI function: Update next cell from update list
     * @returns {boolean} updated successfully
     */
    var nextUpdate = function () {
        var cell = theGrid.nextUpdate();
        if (cell == undefined) return false;

        return updateCell(cell);
    };

    /**
     * UI function: Update square, row and column possible values for cell
     * Display updated cells
     * Update the UI update count
     * @param {number} row - row 1..9
     * @param {number} col - column 1..9
     */
    var updateOtherPossible = function (row, col) {
        let cell = theGrid.cells[row - 1][col - 1];

        clearFormatting();

        var update = false;
        //let explanation = "User update possible " + cell.location();
        let explanation = ""; // Do not need this text because visible in UI
        let union = cellUpdateOtherPossible(cell, explanation);

        // If killer then update cage
        if (cell.cage) {
            for (let cage of cell.cages) {
                union = unionUpdates(union, updateCage(cage, explanation));
            }
        }

        // Format update
        displayCellList(cell, union);

        updateCount++;
        $(updateControl).text(updateCount);

        return;
    };

    /**
     * UI function: Perform a limited number of updates, or finish the puzzle
     * @param {number} limit - optional number of updates to perform
     */
    var finishUpdates = function (limit) {
        var steps = 10000000;
        if (limit != null && limit > 0) steps = limit;
        var status;
        while (steps > 0) {
            status = nextUpdate();
            if (!status) break;
            steps--;
        }
        if (status != undefined) clearFormatting();
    };

    /**
     * UI function: Try to update grid cells until one is updated
     * This does not use the update cell list, but is a workaround in case
     * it is not sufficient - it should not be necessary!
     */
    var lastRetry = 80;
    var retryUpdate = function () {
        var previousLast = lastRetry;
        var update = false;
        while (!update) {
            lastRetry++;
            if (lastRetry >= 81) lastRetry = 0;
            if (lastRetry == previousLast) break;
            var col = lastRetry % 9;
            var row = (lastRetry - col) / 9;
            var cell = theGrid.cells[row][col];
            update = updateCell(cell);
        }
        if (!update) {
            // Last cell was not updated so clear formatting
            clearFormatting();
        }
    };

    /**
     * Initialise Killer Sudoku puzzle
     * @param {Array} killer - killer with array of rows, with array of columns, e.g. [10, "L", 20, "L", "L", 11, "L", "L", 13]
     */
    var initKiller = function (killer) {
        for (let cage of killer) {
            let newCage = new Cage(cage.total, cage.cells);
        }

        if (Cage.validateCages()) return;

        initDisplay();
        Cage.colourCages();

        for (var row = 1; row < 10; row++) {
            for (var col = 1; col < 10; col++) {
                let cell = theGrid.cells[row - 1][col - 1];
                cell.initPossible();
                if (!theGrid.updatedCells.includes(cell)) {
                    theGrid.updatedCells.push(cell);
                }
                displayCell(cell);
            }
        }

        Cage.addVirtualCages();
    };

    return {
        getGrid: getGrid,
        initGrid: initGrid,
        initPuzzle: initPuzzle,
        nextUpdate: nextUpdate,
        finishUpdates: finishUpdates,
        retryUpdate: retryUpdate,
        testFindGroups: testFindGroups,
        initKiller: initKiller,
        cellsInNonet: cellsInNonet,
        getRow: getRow,
        getColumn: getColumn,
        getSquare: getSquare,
        initDisplay: initDisplay,
        setCell: setCell,
        toggle: toggle,
        updateOtherPossible: updateOtherPossible,
    };
})();
