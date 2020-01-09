    var sudoku = (function sudoku() {

        var debug = false;
        var updateControl = null;
        var theGrid;
        var updateCount;
        var clearFormatting, clearColours;

        var getGrid = function() {
            return theGrid;
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
                    if( ! this.updatedCells.includes( cell )) {
                        this.updatedCells.push( cell );
                    }
                    return true;
                }
                else {
                    return false;
                }
            }

            removeCellList( cell, p ) {
                if( cell.removeList(p) ) {
                    if (!this.updatedCells.includes(cell)) {
                        this.updatedCells.push(cell);
                    }
                    return true;
                }
                else {
                    return false;
                }
            }

            toggle( cell, entry ) {
                if( cell.toggle(entry) ) {
                    if( ! this.updatedCells.includes( cell )) {
                        this.updatedCells.push( cell );
                    }
                    return true;
                }
                else {
                    return false;
                }
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

        }

        var initGrid = function (updateCtl, dbg, clrFormatting, clrColours ) {

            debug = dbg;
            updateControl = updateCtl;

            theGrid = new Grid();

            clearFormatting = clrFormatting;
            clearColours = clrColours;
        }

        var displayCell = function (cell) {
            var id = cellId(cell.row, cell.col);
            var html = "";
            // If killer then add cage value
            if (cell.cage != undefined) {
                if (cell.cage.cells[0] == cell) {
                    html = '<div class="cage">' + cell.cage.total + '</div>';
                }
                else {
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
                        }
                        else {
                            text = text + "&nbsp;";
                        }
                        if (entry === 3 || entry === 6) {
                            text = text + "<br>";
                        }
                    }
                }
                html += '<div class="possible">' + text + '</div>';
            }
            else {
                html += '<div class="known">' + cell.value + '</div>';
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
        }

        var setCell = function (row, col, entry) {

            if (!(entry === ".")) {
                theGrid.setCell(row, col, entry);
            }

            displayCell(theGrid.cells[row - 1][col - 1]);
        }

        var initDisplay = function () {
            updateCount = 0;
            $(updateControl).text(updateCount);
            clearFormatting();
            clearColours();
        };

        var initPuzzle = function (puzzle) {

            for(var row = 1; row < 10; row++) {
                for(var col = 1; col < 10; col++) {
                    var entry = puzzle[row-1][col-1];
                    setCell( row, col, entry );
                }
            }

            initDisplay();
        };

        var cellId = function( row, col) {
            return "#g" + row + col;
        }

        var unionPossible = function( cells ) {
            var result = new Array(9);
            for( let index = 0; index < cells.length; index++ ) {
                cells[index].initPossible();
            }
            for( let entry = 1; entry < 10; entry++ ) {
                result[entry-1] = false;
                for( let index = 0; index < cells.length; index++ ) {
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
            for( let index = 0; index < 10; index++ ) {
                if( possible[index] ) {
                    count++;
                }
            }
            return count;
        }

        var intersectPossible = function( p1, p2 ) {
            var count = 0;
            for( let index = 0; index < 10; index++ ) {
                if( p1[index] && p2[index] ) {
                    count++;
                }
            }
            return count;
        }

        var subtractPossible = function( p1, p2 ) {
            var possible = [];
            for( let index = 0; index < 9; index++ ) {
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
            for( let index = f; index < pC.length; index++ ) {
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

        var updateCage = function( cage ) {
            let updatedCells = [];
            let start = 0;
            let total = cage.total;
            let setValues = [];
            let combinations = findCageCombinations(cage, 0, total, setValues);
            // Update possible values to union of combinations
            let unionCombinations = new Array(cage.cells.length);
            for (let index = 0; index < cage.cells.length; index++) {
                unionCombinations[index] = [false, false, false, false, false, false, false, false, false];
            }
            for (const combination of combinations) {
                for (let index = 0; index < combination.length; index++) {
                    const value = combination[index];
                    unionCombinations[index][value-1] = true;
                }
            }
            for (let index = 0; index < cage.cells.length; index++) {
                for (let entry = 1; entry < 10; entry++) {
                    if (!unionCombinations[index][entry-1]) {
                        let cell = cage.cells[index];
                        if (theGrid.removeCell(cell,entry) &&
                            !updatedCells.includes(cell)) {
                            updatedCells.push(cell);
                        }
                    }
                }
            }
            return {
                updates: updatedCells,
                errors: []
            }

        }

        var findCageCombinations = function(cage, index, total, setValues) {
            let cells = cage.cells;
            let newCombinations = [];
            const cell = cells[index];
            for (let value = 1; value < 10; value++) {
                if (cell.possible[value-1] &&
                    !(cage.nodups && setValues.includes(value))){
                    if( index+1 == cells.length) {
                        if (total == value) {
                            setValues.push(value);
                            newCombinations.push(setValues);
                            break;
                        }
                    }
                    else if (total > value) {
                        // find combinations for reduced total in remaining cells
                        let combinations = findCageCombinations(cage, index + 1, total - value, setValues.concat(value));
                        newCombinations.push(...combinations);
                    }
                }
            }
            return newCombinations;
        }

        var createTestCell = function( poss ) {
            var cell = new Cell(1,1);
            for( let entry = 0; entry < 10; entry++ ) {
                var found = false;
                for( let index = 0; index < poss.length; index++ ) {
                    if( poss[index] === entry ) {
                        found = true;
                        break;
                    }
                }
                if( ! found ) {
                    cell.remove( entry );
                }
            }
            return cell;
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
            for( let gl = 2; gl < 4; gl++ ) {
                var groups = findGroups( pC, gl, [], 0 );
                for( let gi = 0; gi < groups.length; gi++ ) {
                    var g = groups[gi];
                    var text = gl + "Group "+gi+":";
                    var possible = unionPossible( g );
                    for( let i = 0; i < 10; i++ ) {
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
            for( let index = 0; index < cells.length; index++ ) {
                var c = cells[index];
                if( c.value == null) {
                    possibleCells.push( c );
                }
            }
            return possibleCells;
        }

        var checkCellList = function( cell, cells ) {
            var errors = [];
            for( let entry = 1; entry < 10; entry++ ) {
                var knownCells = [];
                var possible = 0;
                for( let index = 0; index < cells.length; index++ ) {
                    var c = cells[index];
                    c.initPossible();
                    if( c.value == entry ) {
                        if( knownCells.length > 0 ) {
                            console.log("Duplicate cell entry for cell["+cell.row+","+cell.col+"]");
                            knownCells.push(c);
                        }
                        else {
                            knownCells.push(c);
                        }
                    }
                    else if( c.possible[entry-1] ) {
                        possible++;
                    }
                }
                if( knownCells == null ) {
                    if( possible == 0 ) {
                        console.log("Impossible entry for cell["+cell.row+","+cell.col+"]");
                        errors = cells;
                        break;
                    }
                }
                else if( knownCells.length > 1 ) {
                    for( let i = 0; i < knownCells.length; i++ ) {
                        if( !errors.includes(knownCells[i])) {
                            errors.push(knownCells[i]);
                        }
                    }
                }
            }
            return errors;
        }

        var updateCellList = function( cell, cells, checkRow, checkCol ) {
            var updatedCells = [];
            if( ! ( cell.value == null ) ) {
                // Remove known value from other cells
                for( let index = 0; index < cells.length; index++ ) {
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
                for( let gl = 2; gl < numPossible; gl++ ) {
                    var groups = findGroups( possibleCells, gl, [], 0 );
                    for( let gi = 0; gi < groups.length; gi++ ) {
                        var group = groups[gi];
                        var possible = unionPossible( group );
                        // Remove group from other cells
                        for( let i = 0; i < possibleCells.length; i++ ) {
                            var c = possibleCells[i];
                            if( ! group.includes( c ) ) {
                                if( theGrid.removeCellList( c, possible ) ) {
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
                for( let row = 0; row < 3; row++) {
                    var cells3 = [];
                    for( let col = 0; col < 3; col++) {
                        cells3.push( cells[row*3+col]);
                    }
                    var cells6 = cells.slice();
                    for( let i = 0; i <cells3.length; i++ ) {
                        var index = cells6.indexOf(cells3[i]);
                        cells6.splice(index, 1);
                    }
                    var possible3 = unionPossible(cells3);
                    var possible6 = unionPossible(cells6);
                    var unique3 = subtractPossible(possible3, possible6);
                    if( countPossible(unique3) > 0) {
                        // The unique3 possible values can be removed from the row
                        var r = cells3[0].row;
                        for( let c = 1; c < 10; c++) {
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
                for( let col = 0; col < 3; col++) {
                    var cells3 = [];
                    for( let row = 0; row < 3; row++) {
                        cells3.push( cells[row*3+col]);
                    }
                    var cells6 = cells.slice();
                    for( let i = 0; i <cells3.length; i++ ) {
                        var index = cells6.indexOf(cells3[i]);
                        cells6.splice(index, 1);
                    }
                    var possible3 = unionPossible(cells3);
                    var possible6 = unionPossible(cells6);
                    var unique3 = subtractPossible(possible3, possible6);
                    if( countPossible(unique3) > 0) {
                        // The unique3 possible values can be removed from the col
                        var c = cells3[0].col;
                        for( let r = 1; r < 10; r++) {
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

            var errors = checkCellList( cell, cells );

            return {
                updates: updatedCells,
                errors: errors
            }
        }

        var getSquare = function (irow,icol) {
            var cells = [];
            var row = floor3(irow);
            var col = floor3(icol);
            for (let r = row; r < row + 3; r++) {
                for (let c = col; c < col + 3; c++) {
                    cells.push(theGrid.cells[r - 1][c - 1]);
                }
            }
            return cells;
        }

        var updateCellSquare = function( cell ) {
            var cells = getSquare( cell.row, cell.col );
            return updateCellList( cell, cells, true, true );
        }

        var getRow = function (row) {
            var r = row;
            var cells = [];
            for (let c = 1; c < 10; c++) {
                cells.push(theGrid.cells[r - 1][c - 1]);
            }
            return cells;
        }

        var updateCellRow = function( cell ) {
            var cells = getRow( cell.row );
            return updateCellList( cell, cells, true, false );
        }

        var getColumn = function (col) {
            var c = col;
            var cells = [];
            for (let r = 1; r < 10; r++) {
                cells.push(theGrid.cells[r - 1][c - 1]);
            }
            return cells;
        }

        var updateCellColumn = function( cell ) {
            var cells = getColumn( cell.col );
            return updateCellList( cell, cells, false, true );
        }

        var cellsInNonet = function (cells) {
            let cell = cells[0];
            let rowCells = getRow(cell.row);
            if (cells.filter(x => !rowCells.includes(x)).length == 0) return true;
            let colCells = getColumn(cell.col);
            if (cells.filter(x => !colCells.includes(x)).length == 0) return true;
            let squareCells = getSquare(cell.row, cell.col);
            if (cells.filter(x => !squareCells.includes(x)).length == 0) return true;
            return false;
        }

        var unionUpdates = function( union, updates ) {
            if( union == null ) {
                union = {
                    updates: [],
                    errors: []
                }
            }
            return {
                updates: union.updates.concat( updates.updates ),
                errors: union.errors.concat( updates.errors )
            }
        }

        var updateCell = function( cell ) {
            clearFormatting();

            var update = false;
            var union = {updates:[], errors:[]};
            if( cell.value == null ) {
                // Possible values may have changed due to other updates
                if (cell.updatePossible()) {
                    union.updates.push(cell);
                }
            }

            union = unionUpdates( union, updateCellSquare( cell ) );
            union = unionUpdates( union, updateCellRow( cell ) );
            union = unionUpdates( union, updateCellColumn( cell ) );

            // If killer then update cage
            if (cell.cage) {
                for (let cage of cell.cages) {
                    union = unionUpdates(union, updateCage(cage) );
                }
            }

            // Format update
            let id = cellId(cell.row, cell.col);
            $( id ).addClass("highlight");
            for( let index = 0; index < union.updates.length; index++ ) {
                let cell2 = union.updates[index];
                let id = cellId(cell2.row, cell2.col);
                if( cell2 === cell) {
                    $( id ).removeClass("highlight");
                    $( id ).addClass("updated");
                } else {
                    $( id ).addClass("affected");
                }
                displayCell( cell2 );
            }
            for( let index = 0; index < union.errors.length; index++ ) {
                cell = union.errors[index];
                id = cellId( cell.row, cell.col );
                $( id ).addClass("error");
                displayCell( cell );
            }

            updateCount++;
            $(updateControl).text( updateCount );

            if( union.errors.length > 0 ) return undefined;

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
            var status;
            while( steps > 0 ) {
                status = nextUpdate();
                if( !status ) break;
                steps--;
            }
            if( status != undefined ) clearFormatting();
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

        var initKiller = function (killer) {

            for (let cage of killer) {
                let newCage = new Cage(cage.total, cage.cells);
            }

            Cage.validateCages();

            initDisplay();
            Cage.colourCages();

            for (var row = 1; row < 10; row++) {
                for (var col = 1; col < 10; col++) {
                    let cell = theGrid.cells[row-1][col-1];
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
            initDisplay: initDisplay
        };
    })();
