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

            removeList( p ) {
                var removed = false;
                for( var entry = 1; entry < 10; entry++ ) {
                    if( p[entry-1] ) {
                        if( this.remove( entry ) ) {
                            removed = true;
                        }
                    }
                }
                return removed;
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
                    if( ! this.updatedCells.includes( cell )) {
                        this.updatedCells.push( cell );
                    }
                }
            }

            nextUpdate() {
                var cell = this.updatedCells.shift();
                return cell;
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
        var updateCount;

        var clearFormatting = function() {
            // Undo formatting
            $( ".updated").removeClass("updated");
            $( ".affected").removeClass("affected");
        }

        var initGrid = function( puzzle ) {

            theGrid = new Grid();

            for(var row = 1; row < 10; row++) {
                for(var col = 1; col < 10; col++) {
                    var entry = puzzle[row-1][col-1];
                    setCell( row, col, entry );
                }
            }

            updateCount = 0;
            $( '#numUpdates').text( updateCount );
            clearFormatting();
        };

        var cellId = function( row, col) {
            return "#g" + row + col;
        }

        var displayCell = function( cell ) {
            var id = cellId( cell.row, cell.col );
            if( cell.value == null ) {
                // Show possibles
                var text = "";
                for( var entry = 1; entry < 10; entry++) {
                    if( cell.possible[entry-1]) {
                        text = text + entry;
                    }
                    else {
                        text = text + "&nbsp;";
                    }
                    if( entry === 3 || entry === 6 ) {
                        text = text + "<br>";
                    }
                }
                //$( id ).val( text );
                $( id ).html( '<p class="possible">'+text+'</p>' );
            }
            else {
                $( id ).html( '<p class="known">'+cell.value+'</p>' );
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

        var unionPossible = function( cells ) {
            var result = new Array(9);
            for( var entry = 0; entry < 10; entry++ ) {
                result[entry] = false;
                for( var index = 0; index < cells.length; index++ ) {
                    if( cells[index].possible[entry] ) {
                        result[entry] = true;
                        break;
                    }
                }
            }
            return result;
        }

        var countPossible = function( possible ) {
            var count = 0;
            for( var index = 0; index < 10; index++ ) {
                if( possible[index] ) {
                    count++;
                }
            }
            return count;
        }

        var intersectPossible = function( p1, p2 ) {
            var count = 0;
            for( var index = 0; index < 10; index++ ) {
                if( p1[index] && p2[index] ) {
                    count++;
                }
            }
            return count;
        }

        var findGroups = function( pC, g, sC, f ) {
            var groups = [];
            for( var index = f; index < pC.length; index++ ) {
                var c = pC[index];
                if( ! sC.includes( c ) && countPossible(c.possible) <= g ) {
                    var newSC = sC.concat( c );
                    var possible = unionPossible( newSC );
                    if( countPossible(possible) <= g ) {
                        if( newSC.length === g ) {
                            var ok = true;
                            // check remaining cells do not intersect with group
                            //for( var index2 = 0; index2 < pC.length; index2++ ) {
                            //    var c2 = pC[index2];
                            //    if( ! newSC.includes( c2 ) ) {
                            //        if( intersectPossible( possible, c2.possible ) > 0 ) {
                            //            ok = false;
                            //            break;
                            //        }
                            ///    }
                            //}
                            if( ok ) {
                                groups.push( newSC );
                            }
                        }
                        else {
                            // try adding cells to group
                            var newGroups = findGroups( pC, g, newSC, index+1 );
                            if( newGroups.length > 0 ) {
                                groups = groups.concat( newGroups);
                            }
                        }
                    }
                }
            }
            return groups;
        }

        var createTestCell = function( poss ) {
            var c = new Cell(1,1);
            for( var entry = 0; entry < 10; entry++ ) {
                var found = false;
                for( var index = 0; index < poss.length; index++ ) {
                    if( poss[index] === entry ) {
                        found = true;
                        break;
                    }
                }
                if( ! found ) {
                    c.remove( entry );
                }
            }
            return c;
        }
        var testFindGroups = function() {
            var pC = [
                createTestCell( [1,2] ),
                createTestCell( [3,4] ),
                createTestCell( [1,2] ),
                createTestCell( [4,5] ),
                createTestCell( [3,5] ),
                createTestCell( [6,7] ),
                createTestCell( [2,3,8,9] ),
                createTestCell( [6,7] )
            ];
            for( gl = 2; gl < 4; gl++ ) {
                var groups = findGroups( pC, gl, [], 0 );
                for( var gi = 0; gi < groups.length; gi++ ) {
                    var g = groups[gi];
                    var text = gl + "Group "+gi+":";
                    var possible = unionPossible( g );
                    for( var i = 0; i < 10; i++ ) {
                        if( possible[i]) {
                            text = text + " " + (i+1);
                        }
                    }
                    console.log(text);
                }
            }
        }

        var updateCellList = function( cell, cells ) {
            var updatedCells = [];
            if( ! ( cell.value == null ) ) {
                // Remove known value from other cells
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
                // Check cells for groups
                // Number of possible values is 9 less number known cells
                var numPossible = 9;
                var possibleCells = [];
                for( var index = 0; index < cells.length; index++ ) {
                    var c = cells[index];
                    if( ! (c.value == null) ) {
                        numPossible--;
                    }
                    else {
                        possibleCells.push( c );
                    }
                }
                // Check for groups of 2 to numPossible-1 cells
                for( var gl = 2; gl < numPossible; gl++ ) {
                    var groups = findGroups( possibleCells, gl, [], 0 );
                    for( var gi = 0; gi < groups.length; gi++ ) {
                        var group = groups[gi];
                        var possible = unionPossible( group );
                        // Remove group from other cells
                        for( var i = 0; i < possibleCells.length; i++ ) {
                            var c = possibleCells[i];
                            if( ! group.includes( c ) ) {
                                if( c.removeList( possible ) ) {
                                    if( ! updatedCells.includes(c)) {
                                        updatedCells.push(c);
                                    }
                                }
                            }
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
            clearFormatting();

            var cell = theGrid.nextUpdate();
            if( cell == undefined ) return false;

            var affected = [];
            affected = affected.concat( updateCellSquare( cell ) );
            affected = affected.concat( updateCellRow( cell ) );
            affected = affected.concat( updateCellColumn( cell ) );

            // Format update
            var id = cellId( cell.row, cell.col );
            $( id ).addClass("updated");
            for( var index = 0; index < affected.length; index++ ) {
                cell = affected[index];
                id = cellId( cell.row, cell.col );
                $( id ).addClass("affected");
                displayCell( cell );
            }

            updateCount++;
            $( '#numUpdates').text( updateCount );

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
            finishUpdates: finishUpdates,
            testFindGroups: testFindGroups
        };
    })();
 
    var puzzles = (function() {

        var simplePuzzle = function () {
            var puzzle = [ ".....123.", "123..8.4.", "8.4..765.", "765......", ".........", "......123", ".123..8.4", ".8.4..765", ".765....." ];
            var answer = [ "657941238", "123658947", "894237651", "765123489", "231894576", "948765123", "512376894", "389412765", "476589312" ];
            sudoku.initGrid( puzzle );
        }

        var complexPuzzle = function () {
            var puzzle = [ "7...48...", ".5.....24", ".....9..1", ".2.....5.", "3.9.5...6", "...47..3.", "....1..4.", "18....69.", "2..7....." ];
            var answer = [ "731248965", "958167324", "642539781", "427693158", "319852476", "865471239", "573916842", "184325697", "296784513" ];
            sudoku.initGrid( puzzle );
        }

        return {
            simplePuzzle: simplePuzzle,
            complexPuzzle: complexPuzzle
        };
    })();

    puzzles.simplePuzzle();

    $( '#simplePuzzle').on('click', function() {
        puzzles.simplePuzzle();
    });
    $( '#complexPuzzle').on('click', function() {
        puzzles.complexPuzzle();
    });
    $( '#nextUpdate').on('click', function() {
        sudoku.nextUpdate();
    });
    $( '#finishUpdates').on('click', function() {
        sudoku.finishUpdates();
    });
    $( '#testFindGroups').on('click', function() {
        sudoku.testFindGroups();
    });

});