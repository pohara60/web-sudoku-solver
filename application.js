/**
 * Sudoku
 */


$( document ).ready(function() {
    var sudoku = (function() {

        class Cell {

            constructor(row, col) {
                this.row = row;
                this.col = col;
                this.possible = new Array(9);
                for( var entry = 1; entry < 10; entry++) {
                    this.possible[entry-1] = true;
                }
                this.value = null;
            }

            set value(value) {
                if( value == null) return;
                if( value === this.value ) return;
                if( ! this.value == null ) {
                    alert("Value " + value + "different to value " + this.value + "for Cell[" + this.row + "," + this.col + "]");
                }
                for( var entry = 1; entry < 10; entry++) {
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
            }

            get value() {
                return this._value;
            }

            remove( entry ) {
                if( this.possible[entry-1] ) {
                    this.possible[entry-1] = false;
                    var countTrue = 0;
                    var valueTrue;
                    for( var entry = 1; entry < 10; entry++) {
                        if( this.possible[entry-1]) {
                            countTrue++;
                            valueTrue = entry;
                        }
                    }
                    if( countTrue == 1 ) {
                        this.value = valueTrue;
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
        }

        class Grid {
            constructor() {
                this.cells = new Array(9);
                for(var row = 1; row < 10; row++) {
                    this.cells[row-1] = new Array(9);
                    for(var col = 1; col < 10; col++) {
                        this.cells[row-1][col-1] = new Cell(row,col);
                    }
                }
                this.updatedCells = new Array(0);
            }

            setCell(row, col, value) {
                var cell = this.cells[row-1][col-1];
                if( cell.value != value) {
                    cell.value = value;
                    this.updatedCells.push( cell );
                }
            }

            nextUpdate() {
                var cell = this.updatedCells.shift();
                var result = new Object();
                result.updatedCell = cell;
                return result;
            }

            removeCell( cell, entry ) {
                if( cell.remove(entry) ) {
                    this.updatedCells.push( cell );
                    return true;
                }
                else {
                    return false;
                }
            }

        }

        var theGrid;

        var initGrid = function() {

            theGrid = new Grid();

            // Puzzle from https://www.gmpuzzles.com/blog/sudoku-rules-and-info/
            // Answer:
            puzzle = [ ".....123.", "123..8.4.", "8.4..765.", "765......", ".........", "......123", ".123..8.4", ".8.4..765", ".765....." ];
            answer = [ "657941238", "123658947", "894237651", "765123489", "231894576", "948765123", "512376894", "389412765", "476589312" ];
            for(var row = 1; row < 10; row++) {
                for(var col = 1; col < 10; col++) {
                    var entry = puzzle[row-1][col-1];
                    setCell( row, col, entry );
                }
            }

        };

        var cellId = function( row, col) {
            return "#g" + row + col;
        }

        var displayCell = function( cell ) {
            var id = cellId( cell.row, cell.col );
            if( cell.value == null ) {
                // Show possibles
                $( id ).removeClass( "known");
                $( id ).addClass( "possible");
                var text = "";
                for( var entry = 1; entry < 10; entry++) {
                    if( cell.possible[entry-1]) {
                        text = text + entry + " ";
                    }
                    else {
                        text = text + " ";
                    }
                }
                //$( id ).val( text );
            }
            else {
                $( id ).removeClass( "possible");
                $( id ).addClass( "known");
                $( id ).val( cell.value );
            }
        }

        var setCell = function( row, col, entry) {
            
            if( ! ( entry === ".") ) {
                theGrid.setCell( row, col, entry);
            }

            displayCell( theGrid.cells[row-1][col-1] );
        }

        var mod3 = function( r ) {
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

        var updateCellList = function( cell, cells ) {
            var updatedCells = [];
            if( ! ( cell.value == null ) ) {
                for( var index = 0; index < cells.length; index++ ) {
                    var c = cells[index];
                    if( ! ( c === cell ) ) {
                        if( theGrid.removeCell(c, cell.value) ) {
                            if( ! (c.value == null) ) {
                                // Cell now set, update display
                                setCell( c.row, c.col, c.value );
                            }
                            updatedCells.push(c);
                        }
                    }
                }
            }
            return updatedCells;
        }

        var updateCellSquare = function( cell ) {
            var cells = [];
            var row = mod3( cell.row );
            var col = mod3( cell.col );
            for( var r = row; r < row+3; r++) {
                for( var c = col; c < col+3; c++) {
                    cells.push( theGrid.cells[r-1][c-1] );
                }
            }
            return updateCellList( cell, cells );
        }

        var updateCellRow = function( cell ) {
            var r = cell.row;
            var cells = [];
            for( var c = 1; c < 10; c++) {
                cells.push( theGrid.cells[r-1][c-1] );
            }
            return updateCellList( cell, cells );
        }

        var updateCellColumn = function( cell ) {
            var c = cell.col;
            var cells = [];
            for( var r = 1; r < 10; r++) {
                cells.push( theGrid.cells[r-1][c-1] );
            }
            return updateCellList( cell, cells );
        }

        var nextUpdate = function() {
            // Undo formatting
            $( ".updated").removeClass("updated");
            $( ".affected").removeClass("affected");

            var update = theGrid.nextUpdate();
            if( update == null ) return false;

            var cell = update.updatedCell;

            var affected = [];
            affected = affected.concat( updateCellSquare( cell ) );
            affected = affected.concat( updateCellRow( cell ) );
            affected = affected.concat( updateCellColumn( cell ) );

            // Format update
            var id = cellId( cell.row, cell.col );
            $( id ).parent().addClass("updated");
            for( var index = 0; index < affected.length; index++ ) {
                cell = affected[index];
                id = cellId( cell.row, cell.col );
                $( id ).parent().addClass("affected");
            }
            return true;
        }

        var finishUpdates = function() {
            while( nextUpdate() ) {
                ;
            }
        } 
        return {
            initGrid: initGrid,
            nextUpdate: nextUpdate,
            finishUpdates: finishUpdates
        };
    })();
 
    sudoku.initGrid();

    $( '#nextUpdate').on('click', function() {
        sudoku.nextUpdate();
    });
    $( '#finishUpdates').on('click', function() {
        sudoku.finishUpdates();
    });

});