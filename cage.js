
        class Cage {
            static sudoku = null;
            static initCage( theSudoku ) {
                sudoku = theSudoku;
            }

            constructor(total, locations, virtual = false, nodups = true, source = "") {
                this.total = total;
                this.cells = [];
                this.virtual = virtual;
                this.nodups = nodups;
                this.source = source;
                // Get cage cells
                locations.forEach(element => {
                    let cell = sudoku.getGrid().cells[element[0] - 1][element[1] - 1];
                    this.cells.push(cell);
                });
                // Check for duplicate virtual cage - look at cages for first cell
                if (virtual) {
                    let cages = this.cells[0].cages;
                    let duplicate = null;
                    for (const cage of cages) {
                        if (cage.total != this.total) continue;
                        if (cage.cells.length != this.cells.length) continue;
                        let difference = cage.cells.filter(x => !this.cells.includes(x));
                        if (difference.length > 0) continue;
                        duplicate = cage;
                        // The cage will be a zombie
                        this.zombie = true;
                        return;
                    }
                }
                // Set cage for cells
                this.zombie = false;
                this.cells.forEach(cell => {
                    if (!virtual) {
                        cell.cage = this;
                    }
                    if (!cell.cages) {
                        cell.cages = [this];
                    } else {
                        cell.cages.push(this);
                    }
                });
                // Add non-virtual cage to the grid display
                if (!virtual) {
                    if (sudoku.getGrid().cages == null) {
                        sudoku.getGrid().cages = [this];
                    } else {
                        sudoku.getGrid().cages.push(this);
                    }
                } else {
                    if (sudoku.debug) console.log("Add virtual cage: " + this);
                }
            }

            toString() {
                let sortedCells = this.cells.sort();
                var text = String(this.total) + 
                            "["+this.cells.length+"]"+
                            (this.virtual?" v":"") + (this.nodups?"n":" ") +": ";
                text += sortedCells.map(cell => "[" + cell.row + "," + cell.col + "]").join(",");
                if (this.source != "") {
                    text += " from "+this.source;
                }
                return text;
            }

            static colourCages(){
                for (let cage of sudoku.getGrid().cages) {
                    let adjacentCells = [];
                    for (let cell of cage.cells) {
                        adjacentCells.push(...sudoku.getGrid().adjacentCells(cell));
                    }
                    adjacentCells = adjacentCells.filter(n => !cage.cells.includes(n));
                    let adjacentCages = adjacentCells.map(x => x.cage);
                    let adjacentColours = adjacentCages.map(c => c.colour);
                    cage.colour = 1;
                    while (adjacentColours.includes(cage.colour)) {
                        cage.colour ++;
                    }
                }
            }

            static validateCages(){
                // @ts-ignore
                let error = false;
                let grandTotal = 0;
                let numCells = 0;
                let allCells = [];
                let cages = sudoku.getGrid().cages;
                for (let i = 0; i < cages.length; i++) {
                    // Does the cage have duplicate cells
                    let cage = cages[i];
                    let cells = cage.cells;
                    for (let i = 0; i < cells.length; i++){
                        for (let j = i+1; j < cells.length; j++) {
                            if (cells[i] === cells[j]) {
                                alert("Cell " + cells[i] + " is duplicated in cage!");
                            }
                        }
                    }
                    // Do the cell cages overlap?
                    for (let j = i+1; j < cages.length; j++) {
                        for (let c1 of cages[i].cells) {
                            if (cages[j].cells.includes(c1)) {
                                alert("Cell " + c1 + " appears in more than one cage!");
                                error = true;
                            }
                        }
                    }    
                    // Sum totals and number of cells
                    grandTotal += cages[i].total;
                    numCells += cages[i].cells.length;
                    allCells += cages[i].cells;
                }
                if (grandTotal != 45*9) {
                    // @ts-ignore
                    alert("Cages total is " + grandTotal + ", should be ", 45*9 );
                    error = true;
                }
                if (numCells != 81) {
                    let missingCells = "";
                    for (let r = 1; r < 10; r++) {
                        for (let c = 1; c < 10; c++) {
                            if (!allCells.includes(sudoku.getGrid().cells[r-1][c-1])) {
                                missingCells += "["+r+","+c+"]";
                            }
                        }
                    }
                    alert("Cages only include " + numCells + " cells, should be 81\n"+
                          "Missing cells: " + missingCells);
                    error = true;
                }
            }

            static addVirtualCage(cells, source) {
                if (typeof cells == "undefined" || cells == null || cells.length == 0) {
                    alert("Cells not valid: " + cells);
                }
                // If cells include whole cages, make a virtual cage for the other cells
                let newLocations = [];
                let cellsTotal = 45 * (cells.length/9);
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
                        if (typeof cage == "undefined" || cage == null || cage.cells.length == 0) {
                            alert("Cage not valid: " + cage);
                        }
                        let difference = cage.cells.filter(x => !cells.includes(x));
                        if (difference.length > 0) {
                            // Add the cell to the new cage
                            newCells.push(cell);
                            newLocations.push([cell.row, cell.col]);
                            // Add non-included cells from this cell's cage to other cage
                            let firstOtherCellForCage = true;
                            for (const otherCell of difference) {
                                if (!otherCells.includes(otherCell)) {
                                    otherCells.push(otherCell);
                                    otherLocations.push([otherCell.row, otherCell.col])
                                    if (firstOtherCellForCage) {
                                        firstOtherCellForCage = false;
                                        otherCagesTotal += cell.cage.total;
                                    }
                                }
                            }
                        }
                        else {
                            newTotal -= cage.total;
                            unionCells.push(...cage.cells);
                        }
                    }
                }
                if (newTotal != 0 && newTotal != cellsTotal) {
                    // If the cage is in a nonet, then it does not allow duplicates
                    const maxCageLength = 5;
                    if (newLocations.length <= maxCageLength) {
                        let nodups = sudoku.cellsInNonet(newCells)
                        let newCage = new Cage(newTotal, newLocations, true, nodups, source);
                    }
                    if (otherLocations.length <= maxCageLength) {
                        let nodups = sudoku.cellsInNonet(otherCells)
                        let otherTotal = otherCagesTotal-newTotal;
                        let otherCage = new Cage(otherTotal, otherLocations, true, nodups, source + " x");
                    }
                }
            }

            static addVirtualCages() {
                for (let size = 1; size <= 5; size++) {
                    for (let r = 1; r <= 10 - size; r++) {
                        let cells = [];
                        for (let r2 = r; r2 < r+size; r2++) {
                            cells.push(...sudoku.getRow( r2 ));
                        }
                        let source = size == 1 ? "row "+r : "rows "+r+"-"+(r+size-1);
                        this.addVirtualCage( cells, source );
                    }
                }
                for (let size = 1; size <= 5; size++) {
                    for (let c = 1; c <= 10 - size; c++) {
                        let cells = [];
                        for (let c2 = c; c2 < c + size; c2++) {
                            cells.push(...sudoku.getColumn(c2));
                        }
                        let source = size == 1 ? "col " + c : "cols " + c + "-" + (c + size - 1);
                        this.addVirtualCage(cells, source);
                    }
                }
                for (let size = 1; size <= 2; size++) {
                    for (let r = 1; r <= 9; r += 3) {
                        for (let c = 1; c <= 9; c += 3) {
                            if (size == 1 ) {
                                let cells = [];
                                cells.push(...sudoku.getSquare(r, c));
                                let source = "sqr " + r + "," + c;
                                this.addVirtualCage(cells, source);
                            }
                            if (size == 2) {
                                if (r < 6) {
                                    let cells = [];
                                    cells.push(...sudoku.getSquare(r,c));
                                    cells.push(...sudoku.getSquare(r+3, c));
                                    let source = "sqrs " + r + "," + c + "-" + (r + 3) + "," + c;
                                    this.addVirtualCage(cells, source);
                                }
                                if (c < 6) {
                                    let cells = [];
                                    cells.push(...sudoku.getSquare(r, c));
                                    cells.push(...sudoku.getSquare(r, c + 3));
                                    let source = "sqrs " + r + "," + c + "-" + r + "," + (c+3);
                                    this.addVirtualCage(cells, source);
                                }
                            }
                        }
                    }
                }
            }
        }
