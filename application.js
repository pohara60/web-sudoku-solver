/**
 * Sudoku
 */


$( document ).ready(function() {
    var sudoku = (function() {

        var debug = false;
        var theGrid;
        var updateCount;

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

            initPossible() {
                if( this.possible == null ) {
                    this.possible = new Array(9);
                    for( var entry = 1; entry < 10; entry++) {
                        this.possible[entry-1] = true;
                    }
                    // Do not update Possible because breaks algorithm
                    //updatePossible();
                    if(debug) console.log("initPossible: "+this.toString());
                }
            }

            updatePossible() {
                this.initPossible();

                // Remove known values from square, row, col
                var update = false;
                var row = floor3( this.row );
                var col = floor3( this.col );
                for( var r = row; r < row+3; r++) {
                    for( var c = col; c < col+3; c++) {
                        if( ! (r === this.row && c === this.col )) {
                            var cell = theGrid.cells[r-1][c-1];
                            var value = cell.value;
                            if( value != null ) {
                                if( this.remove(value) ) update = true;
                            }
                        }
                    }
                }
                var r = this.row;
                for( var c = 1; c < 10; c++) {
                    if( ! (r === this.row && c === this.col )) {
                        var cell = theGrid.cells[r-1][c-1];
                        var value = cell.value;
                        if( value != null ) {
                            if( this.remove(value) ) update = true;
                        }
                    }
                }
                var c = this.col;
                for( var r = 1; r < 10; r++) {
                    if( ! (r === this.row && c === this.col )) {
                        var cell = theGrid.cells[r-1][c-1];
                        var value = cell.value;
                        if( value != null ) {
                            if( this.remove(value) ) update = true;
                        }
                    }
                }
                if(debug) console.log("updatePossible: "+this.toString());
                return update;
            }

            constructor(row, col) {
                this.row = row;
                this.col = col;
                this.possible = null;
                this.value = null;
            }

            set value(entry) {
                if( entry == null) return;
                var value = Number(entry);
                if( value === this.value ) return;
                if( ! this.value == null ) {
                    alert("Value " + value + "different to value " + this.value + "for Cell[" + this.row + "," + this.col + "]");
                }
                this.initPossible();
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
                theGrid.unknownCells--;
                if(debug) console.log("set value: "+this);
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
                    for( var e = 1; e < 10; e++) {
                        if( this.possible[e-1]) {
                            countTrue++;
                            valueTrue = e;
                        }
                    }
                    if( countTrue == 1 ) {
                        this.value = valueTrue;
                    }
                    if(debug) console.log("remove "+entry+": "+this);
                    return true;
                }
                else {
                    return false;
                }
            }

            removeList( p ) {
                var removed = false;
                this.initPossible();
                for( var entry = 1; entry < 10; entry++ ) {
                    if( p[entry-1] ) {
                        if( this.remove( entry ) ) {
                            removed = true;
                        }
                    }
                }
                return removed;
            }

            toString() {
                var text = "["+this.row+","+this.col+"] = ";
                if( this.possible == null ) {
                    text = text + "unknown";
                }
                else {
                    for( var entry = 1; entry < 10; entry++ ) {
                        if( this.possible[entry-1] ) {
                            text = text + entry;
                        }
                    }
                }
                return text;
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
                this.unknownCells = 81;
            }

            setCell(row, col, entry) {
                var cell = this.cells[row-1][col-1];
                var value = Number(entry);
                if( cell.value != value) {
                    cell.value = value;
                    if( ! this.updatedCells.includes( cell )) {
                        this.updatedCells.push( cell );
                    }
                }
            }

            nextUpdate() {
                if( this.unknownCells === 0 ) return undefined;

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

            removeCellList( cell, p ) {
                if( cell.removeList(p) ) {
                    this.updatedCells.push( cell );
                    return true;
                }
                else {
                    return false;
                }
            }

        }

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
                var text = "";
                if( cell.possible != null ) {
                    // Show possibles
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
                }
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

        var unionPossible = function( cells ) {
            var result = new Array(9);
            for( var index = 0; index < cells.length; index++ ) {
                cells[index].initPossible();
            }
            for( var entry = 1; entry < 10; entry++ ) {
                result[entry-1] = false;
                for( var index = 0; index < cells.length; index++ ) {
                    if( cells[index].possible[entry-1] ) {
                        result[entry-1] = true;
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

        var subtractPossible = function( p1, p2 ) {
            var possible = [];
            for( var index = 0; index < 9; index++ ) {
                if( p1[index] && !p2[index] ) {
                    possible[index] = true;
                }
                else {
                    possible[index] = false;
                }
            }
            return possible;
        }

        var findGroups = function( pC, g, sC, f ) {
            var groups = [];
            for( var index = f; index < pC.length; index++ ) {
                var c = pC[index];
                c.initPossible();
                if( ! sC.includes( c ) && countPossible(c.possible) <= g ) {
                    var newSC = sC.concat( c );
                    var possible = unionPossible( newSC );
                    if( countPossible(possible) <= g ) {
                        if( newSC.length === g ) {
                            groups.push( newSC );
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


        var unknownCells = function( cells ) {
            var possibleCells = [];
            for( var index = 0; index < cells.length; index++ ) {
                var c = cells[index];
                if( c.value == null) {
                    possibleCells.push( c );
                }
            }
            return possibleCells;
        }

        var checkCellList = function( cell, cells ) {
            for( var entry = 1; entry < 10; entry++ ) {
                var known = false;
                var possible = 0;
                for( var index = 0; index < cells.length; index++ ) {
                    var c = cells[index];
                    c.initPossible();
                    if( c.value == entry ) {
                        if( known ) {
                            alert("Duplicate cell entry for cell["+cell.row+","+cell.col+"]");
                        }
                        else {
                            known = true;
                        }
                    }
                    else if( c.possible[entry-1] ) {
                        possible++;
                    }
                }
                if( !known && possible == 0 ) {
                    alert("Impossible entry for cell["+cell.row+","+cell.col+"]");
                }
            }
        }

        var updateCellList = function( cell, cells, checkRow, checkCol ) {
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
                            if( ! updatedCells.includes(c)) {
                                updatedCells.push(c);
                            }
                        }
                    }
                }
            }

            // Check cells for groups
            // Number of possible values is 9 less number known cells
            var possibleCells = unknownCells( cells );
            var numPossible = possibleCells.length;

            // Check for groups of 2 to numPossible-1 cells
            var update = true;
            while( update ) {
                update = false;
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
                                    update = true;
                                    if( ! updatedCells.includes(c)) {
                                        updatedCells.push(c);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Check for rows or columns that must contain entry, clear from rest of row or column
            if( checkRow ) {
                for( row = 0; row < 3; row++) {
                    var cells3 = [];
                    for( col = 0; col < 3; col++) {
                        cells3.push( cells[row*3+col]);
                    }
                    var cells6 = cells.slice();
                    for( i = 0; i <cells3.length; i++ ) {
                        var index = cells6.indexOf(cells3[i]);
                        cells6.splice(index, 1);
                    }
                    var possible3 = unionPossible(cells3);
                    var possible6 = unionPossible(cells6);
                    var unique3 = subtractPossible(possible3, possible6);
                    if( countPossible(unique3) > 0) {
                        // The unique3 possible values can be removed from the row
                        var r = cells3[0].row;
                        for( var c = 1; c < 10; c++) {
                            var cell = theGrid.cells[r-1][c-1];
                            if( cell.value == null &&
                                !cells3.includes(cell)) {
                                if( theGrid.removeCellList(cell,unique3)) {
                                    if( ! updatedCells.includes(c)) {
                                        updatedCells.push(cell);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if( checkCol ) {
                for( col = 0; col < 3; col++) {
                    var cells3 = [];
                    for( row = 0; row < 3; row++) {
                        cells3.push( cells[row*3+col]);
                    }
                    var cells6 = cells.slice();
                    for( i = 0; i <cells3.length; i++ ) {
                        var index = cells6.indexOf(cells3[i]);
                        cells6.splice(index, 1);
                    }
                    var possible3 = unionPossible(cells3);
                    var possible6 = unionPossible(cells6);
                    var unique3 = subtractPossible(possible3, possible6);
                    if( countPossible(unique3) > 0) {
                        // The unique3 possible values can be removed from the col
                        var c = cells3[0].col;
                        for( var r = 1; r < 10; r++) {
                            var cell = theGrid.cells[r-1][c-1];
                            if( cell.value == null &&
                                !cells3.includes(cell)) {
                                if( theGrid.removeCellList(cell,unique3)) {
                                    if( ! updatedCells.includes(c)) {
                                        updatedCells.push(cell);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            checkCellList( cell, cells );

            return updatedCells;
        }

        var updateCellSquare = function( cell ) {
            var cells = [];
            var row = floor3( cell.row );
            var col = floor3( cell.col );
            for( var r = row; r < row+3; r++) {
                for( var c = col; c < col+3; c++) {
                    cells.push( theGrid.cells[r-1][c-1] );
                }
            }
            return updateCellList( cell, cells, true, true );
        }

        var updateCellRow = function( cell ) {
            var r = cell.row;
            var cells = [];
            for( var c = 1; c < 10; c++) {
                cells.push( theGrid.cells[r-1][c-1] );
            }
            return updateCellList( cell, cells, true, false );
        }

        var updateCellColumn = function( cell ) {
            var c = cell.col;
            var cells = [];
            for( var r = 1; r < 10; r++) {
                cells.push( theGrid.cells[r-1][c-1] );
            }
            return updateCellList( cell, cells, false, true );
        }

        var updateCell = function( cell ) {
            clearFormatting();

            var update = false;
            if( cell.value == null ) {
                // Possible values may have changed due to other updates
                update = cell.updatePossible();
            }

            var affected = [];
            affected = affected.concat( updateCellSquare( cell ) );
            affected = affected.concat( updateCellRow( cell ) );
            affected = affected.concat( updateCellColumn( cell ) );

            // Format update
            var id = cellId( cell.row, cell.col );
            $( id ).addClass("updated");
            if( update ) displayCell( cell );
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

        var nextUpdate = function() {

            var cell = theGrid.nextUpdate();
            if( cell == undefined ) return false;

            return updateCell( cell );
        }

        var finishUpdates = function( limit ) {
            var steps = 10000000;
            if( limit != null && limit > 0 ) steps = limit;
            while( steps > 0 && nextUpdate() ) {
                steps--;
            }
            clearFormatting();
        } 

        var lastRetry = 80;
        var retryUpdate = function() {
            var previousLast = lastRetry;
            var update = false;
            while( !update ) {
                lastRetry++;
                if( lastRetry >= 81 ) lastRetry = 0;
                if( lastRetry == previousLast ) break;
                var col = (lastRetry) % 9;
                var row = (lastRetry - col)  / 9;
                var cell = theGrid.cells[row][col];
                update = updateCell( cell );
            }
            if( !update ) {
                // Last cell was not updated so clear formatting
                clearFormatting();
            }
        }

        return {
            initGrid: initGrid,
            nextUpdate: nextUpdate,
            finishUpdates: finishUpdates,
            retryUpdate: retryUpdate,
            testFindGroups: testFindGroups
        };
    })();
 
    var puzzles = (function() {

        var simplePuzzle = function () {
            var puzzle = [ ".....123.", "123..8.4.", "8.4..765.", "765......", ".........", "......123", ".123..8.4", ".8.4..765", ".765....." ];
            sudoku.initGrid( puzzle );
        }

        var complexPuzzle = function () {
            var puzzle = [ "7...48...", ".5.....24", ".....9..1", ".2.....5.", "3.9.5...6", "...47..3.", "....1..4.", "18....69.", "2..7....." ];
            sudoku.initGrid( puzzle );
        }

        var nextPuzzle = 0;
        var otherPuzzle = function () {
            var puzzles = [
                //[ ".........", ".........", ".........", ".........", ".........", ".........", ".........", ".........", "........." ],
                [ "7......4.", ".....827.", ".4.9.5...", "8.9..3...", "5.3...6.2", "...1..3.8", "...5.7.2.", ".564.....", ".9......3" ],
                [ "...37....", "26.......", ".3.8...47", "9.3..7.1.", ".4.....3.", ".7.9..4.6", "51...2.7.", ".......21", "....18..." ],
                [ "..4.5..2.", "3....97.6", "....78..3", ".15...8..", ".......5.", ".62...3..", "....17..5", "1....64.2", "..3.9..8." ],
                [ "...43....", "..9.2.8..", ".....7.29", ".5....1.3", "..62.57..", "8.1....6.", "14.9.....", "..2.6.9..", "....43..." ],
            ];
            if( nextPuzzle >= puzzles.length ) {
                nextPuzzle = 0;
            }
            sudoku.initGrid( puzzles[nextPuzzle] );
            nextPuzzle++;
        }



        return {
            simplePuzzle: simplePuzzle,
            complexPuzzle: complexPuzzle,
            otherPuzzle: otherPuzzle
        };
    })();

    puzzles.simplePuzzle();

    $( '#simplePuzzle').on('click', function() {
        puzzles.simplePuzzle();
    });
    $( '#complexPuzzle').on('click', function() {
        puzzles.complexPuzzle();
    });
    $( '#otherPuzzle').on('click', function() {
        puzzles.otherPuzzle();
    });
    $( '#nextUpdate').on('click', function() {
        sudoku.nextUpdate();
    });
    $( '#retryUpdate').on('click', function() {
        sudoku.retryUpdate();
    });
    $( '#finishUpdates').on('click', function() {
        var limitString = $( "#limitUpdates" ).val();
        var limit = Number( limitString );
        sudoku.finishUpdates( limit );
    });
    $( '#testFindGroups').on('click', function() {
        sudoku.testFindGroups();
    });

});