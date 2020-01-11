
        var floor3 = function( r ) {
            if( r >= 1 && r <= 3) {
                return 1;
            }
            if( r >= 4 && r <= 6) {
                return 4;
            }
            if( r >= 7 && r <= 9) {
                return 7;
            }
            alert("Bad row/col number");
        }

        class Cell {
            static sudoku = null;
            static theGrid = null;
            static initCell(theSudoku) {
                Cell.sudoku = theSudoku;
                Cell.theGrid = Cell.sudoku.getGrid();
            }

            constructor(row, col) {
                this.row = row;
                this.col = col;
                this.possible = null;
                this.value = null;
                this.cage = null;
            }

            initPossible() {
                if( this.possible == null ) {
                    this.possible = new Array(9);
                    for( let entry = 1; entry < 10; entry++) {
                        this.possible[entry-1] = true;
                    }
                    // Do not update Possible because breaks algorithm
                    //updatePossible();
                    //if(debug) console.log("initPossible: "+this.toString());
                }
            }

            updatePossible() {
                this.initPossible();

                // Remove known values from square, row, col
                var update = false;
                var row = floor3( this.row );
                var col = floor3( this.col );
                for( let r = row; r < row+3; r++) {
                    for( let c = col; c < col+3; c++) {
                        if( ! (r === this.row && c === this.col )) {
                            var cell = Cell.theGrid.cells[r-1][c-1];
                            var value = cell.value;
                            if( value != null ) {
                                if( this.remove(value) ) update = true;
                            }
                        }
                    }
                }
                var r = this.row;
                for( let c = 1; c < 10; c++) {
                    if( ! (r === this.row && c === this.col )) {
                        var cell = Cell.theGrid.cells[r-1][c-1];
                        var value = cell.value;
                        if( value != null ) {
                            if( this.remove(value) ) update = true;
                        }
                    }
                }
                var c = this.col;
                for( let r = 1; r < 10; r++) {
                    if( ! (r === this.row && c === this.col )) {
                        var cell = Cell.theGrid.cells[r-1][c-1];
                        var value = cell.value;
                        if( value != null ) {
                            if( this.remove(value) ) update = true;
                        }
                    }
                }
                if(sudoku.debug) console.log("updatePossible: "+this.toString());
                return update;
            }

            set value(entry) {
                if( entry == null) {
                    if( this._value != null ) {
                        Cell.theGrid.unknownCells++;
                        this._value = null;
                    }
                    return;
                }

                var value = Number(entry);
                if( value === this.value ) return;
                if( ! this.value == null ) {
                    alert("Value " + value + "different to value " + this.value + "for Cell[" + this.row + "," + this.col + "]");
                }
                this.initPossible();
                for( let entry = 1; entry < 10; entry++) {
                    if( entry === value ) {
                        if( !this.possible[entry-1]) {
                            alert("Value " + value + "is not possible for Cell[" + this.row + "," + this.col + "]");
                            return;
                        }
                    }
                    else {
                        this.possible[entry-1] = false;
                    }
                }
                this._value = value;
                Cell.theGrid.unknownCells--;
                if(sudoku.debug) console.log("set value: "+this);
            }

            get value() {
                return this._value;
            }

            remove( entry ) {
                this.initPossible();
                if( this.possible[entry-1] ) {
                    this.possible[entry-1] = false;
                    var countTrue = 0;
                    var valueTrue;
                    for( let e = 1; e < 10; e++) {
                        if( this.possible[e-1]) {
                            countTrue++;
                            valueTrue = e;
                        }
                    }
                    if( countTrue == 1 ) {
                        this.value = valueTrue;
                    }
                    if(sudoku.debug) console.log("remove "+entry+": "+this);
                    return true;
                }
                else {
                    return false;
                }
            }

            removeList( p ) {
                var removed = false;
                this.initPossible();
                for( let entry = 1; entry < 10; entry++ ) {
                    if( p[entry-1] ) {
                        if( this.remove( entry ) ) {
                            removed = true;
                        }
                    }
                }
                return removed;
            }


            toggle( entry ) {
                // Do not initPossible because it sets all entries to possible
                if( this.possible == null ) {
                    this.possible = new Array(9);
                }
                // If set then unset
                if( this.value != null ) {
                    this.value = null;
                }
                if( this.possible[entry-1] ) {
                    this.possible[entry - 1] = false;
                    /* Do not use this.remove to auto set values in manual mode
                    this.remove( entry );
                    */
                }
                else {
                    this.possible[entry-1] = true;
                    /* Do not auto set values in manual mode 
                    var countTrue = 0;
                    for( let e = 1; e < 10; e++) {
                        if( this.possible[e-1]) {
                            countTrue++;
                        }
                    }
                    if( countTrue == 1 ) {
                        this.value = entry;
                    }
                    */
                }
                if(sudoku.debug) console.log("toggle "+entry+": "+this);
                return true;
            }

            toString() {
                var text = "["+this.row+","+this.col+"] = ";
                if( this.possible == null ) {
                    text = text + "unknown";
                }
                else {
                    for( let entry = 1; entry < 10; entry++ ) {
                        if( this.possible[entry-1] ) {
                            text = text + entry;
                        }
                    }
                }
                return text;
            }
        }
