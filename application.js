/**
 * Sudoku
 */


$( document ).ready(function() {
    var sudoku = (function() {

        var debug = true;
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

        class Cage {
            constructor(total, locations, virtual = false, nodups = true) {
                this.total = total;
                this.cells = [];
                this.virtual = virtual;
                this.nodups = nodups;
                locations.forEach(element => {
                    let cell = theGrid.cells[element[0] - 1][element[1] - 1];
                    this.cells.push(cell);
                    if (!virtual) {
                        cell.cage = this;
                    }
                    if (!cell.cages) {
                        cell.cages = [this];
                    } else {
                        cell.cages.push(this);
                    }
                });
                if (!virtual) {
                    if (theGrid.cages == null) {
                        theGrid.cages = [this];
                    } else {
                        theGrid.cages.push(this);
                    }
                }
            }

            static colourCages(){
                for (let cage of theGrid.cages) {
                    let adjacentCells = [];
                    for (let cell of cage.cells) {
                        adjacentCells.push(...theGrid.adjacentCells(cell));
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
                let cages = theGrid.cages;
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
                            if (! allCells.includes(theGrid.cells[r-1][c-1])) {
                                missingCells += "["+r+","+c+"]";
                            }
                        }
                    }
                    alert("Cages only include " + numCells + " cells, should be 81\n"+
                          "Missing cells: " + missingCells);
                    error = true;
                }
            }

            static addVirtualCage(cells) {
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
                    let nodups = cellsTotal == 45;
                    const maxCageLength = 4;
                    if (newLocations.length <= maxCageLength) {
                        let newCage = new Cage(newTotal, newLocations, true, nodups);
                        if (debug) console.log("Add virtual cage: " + newTotal + "=" + newLocations + ", nodups="+nodups);
                    }
                    if (otherLocations.length <= maxCageLength) {
                        if (nodups) nodups = cellsInNonet(otherCells)
                        let otherTotal = otherCagesTotal-newTotal;
                        let otherCage = new Cage(otherTotal, otherLocations, true, nodups);
                        if (debug) console.log("Add other virtual cage: " + otherTotal + "=" + otherLocations + ", nodups=" + nodups);
                    }
                }
            }

            static addVirtualCages() {
                for (let size = 1; size <= 5; size++) {
                    for (let r = 1; r <= 10 - size; r++) {
                        let cells = [];
                        for (let r2 = r; r2 < r+size; r2++) {
                            cells.push(...getRow( r2 ));
                        }
                        this.addVirtualCage( cells );
                    }
                }
                for (let size = 1; size <= 5; size++) {
                    for (let c = 1; c <= 10 - size; c++) {
                        let cells = [];
                        for (let c2 = c; c2 < c + size; c2++) {
                            cells.push(...getColumn(c2));
                        }
                        this.addVirtualCage(cells);
                    }
                }
                for (let size = 1; size <= 2; size++) {
                    for (let r = 1; r <= 9; r += 3) {
                        for (let c = 1; c <= 9; c += 3) {
                            if (size == 1 ) {
                                let cells = [];
                                cells.push(...getSquare(r, c));
                                this.addVirtualCage(cells);
                            }
                            if (size == 2) {
                                if (r < 6) {
                                    let cells = [];
                                    cells.push(...getSquare(r,c));
                                    cells.push(...getSquare(r+3, c));
                                    this.addVirtualCage(cells);
                                }
                                if (c < 6) {
                                    let cells = [];
                                    cells.push(...getSquare(r, c));
                                    cells.push(...getSquare(r, c + 3));
                                    this.addVirtualCage(cells);
                                }
                            }
                        }
                    }
                }
            }
        }

        class Cell {

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
                    if(debug) console.log("initPossible: "+this.toString());
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
                            var cell = theGrid.cells[r-1][c-1];
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
                        var cell = theGrid.cells[r-1][c-1];
                        var value = cell.value;
                        if( value != null ) {
                            if( this.remove(value) ) update = true;
                        }
                    }
                }
                var c = this.col;
                for( let r = 1; r < 10; r++) {
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

            set value(entry) {
                if( entry == null) {
                    if( this._value != null ) {
                        theGrid.unknownCells++;
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
                    for( let e = 1; e < 10; e++) {
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
                    this.remove( entry );
                }
                else {
                    this.possible[entry-1] = true;
                    var countTrue = 0;
                    for( let e = 1; e < 10; e++) {
                        if( this.possible[e-1]) {
                            countTrue++;
                        }
                    }
                    if( countTrue == 1 ) {
                        this.value = entry;
                    }
                }
                if(debug) console.log("toggle "+entry+": "+this);
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

        var clearFormatting = function() {
            // Undo formatting
            $( ".updated").removeClass("updated");
            $( ".affected").removeClass("affected");
            $( ".highlight").removeClass("highlight");
            $( ".error").removeClass("error");
        }

        var clearColours = function () {
            // Undo colouring
            $(".c1").removeClass("c1");
            $(".c2").removeClass("c2");
            $(".c3").removeClass("c3");
            $(".c4").removeClass("c4");
        }

        var initGrid = function( puzzle ) {

            theGrid = new Grid();

            for(var row = 1; row < 10; row++) {
                for(var col = 1; col < 10; col++) {
                    var entry = puzzle[row-1][col-1];
                    setCell( row, col, entry );
                }
            }

            initDisplay();
        };

        var initDisplay = function() {
            updateCount = 0;
            $( '#numUpdates').text( updateCount );
            clearFormatting();
            clearColours();
        };

        var cellId = function( row, col) {
            return "#g" + row + col;
        }

        var displayCell = function( cell ) {
            var id = cellId( cell.row, cell.col );
            var html = "";
            // If killer then add cage value
            if (cell.cage != undefined ) {
                if (cell.cage.cells[0] == cell) {
                    html = '<div class="cage">' + cell.cage.total + '</div>';
                }
                else {
                    html = '<div class="cage">&nbsp;</div>';
                }
            }
            if( cell.value == null ) {
                var text = "";
                if( cell.possible != null ) {
                    // Show possibles
                    for( let entry = 1; entry < 10; entry++) {
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
                html += '<div class="possible">'+text+'</div>';
            }
            else {
                html += '<div class="known">'+cell.value+'</div>';
            }
            $(id).html( html );
            // If killer then colour cell
            if (cell.cage != undefined) {
                let colour = cell.cage.colour;
                if (colour != undefined) {
                    let colourClass = "c"+colour;
                    $( id ).addClass(colourClass);
                }
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

            /* If killer then check for virtual cage
            if (cell.cage) {
                updatedCells = Cage.addVirtualCage(cells);
            }
            */

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
            if( cell.value == null ) {
                // Possible values may have changed due to other updates
                update = cell.updatePossible();
            }

            var union = null;
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
            var id = cellId( cell.row, cell.col );
            $( id ).addClass("updated");
            if( update ) displayCell( cell );
            for( let index = 0; index < union.updates.length; index++ ) {
                cell = union.updates[index];
                id = cellId( cell.row, cell.col );
                $( id ).addClass("affected");
                displayCell( cell );
            }
            for( let index = 0; index < union.errors.length; index++ ) {
                cell = union.errors[index];
                id = cellId( cell.row, cell.col );
                $( id ).addClass("error");
                displayCell( cell );
            }

            updateCount++;
            $( '#numUpdates').text( updateCount );

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

        var highlight = function(e) {
            var target = e.target;
            var td = target.closest("td");
            clearFormatting();
            $(td).addClass("highlight");
            e.stopPropagation();
        }
        var keydown = function(e) {
            e.stopPropagation();
            var target = e.target;
            var td = target.closest("td");
            var id = $( td ).attr("id");
            var row = Number(id.substr(1,1));
            var col = Number(id.substr(2,1));
            var cell = theGrid.cells[row-1][col-1];
            var code = e.which;
            // Navigation
            if( code >= 37 && code <= 40 ) {
                if( code == 37 ) {
                    // Left arrow
                    col--;
                    if( col == 0 ) {
                        col = 9;
                        row--;
                        if( row == 0 ) row = 9;
                    }
                }
                if( code == 38 ) {
                    // Up arrow
                    row--;
                    if( row == 0 ) {
                        row = 9;
                        col--;
                        if( col == 0 ) col = 9;
                    }
                }
                if( code == 39 ) {
                    // Right arrow
                    col++;
                    if( col == 10 ) {
                        col = 1;
                        row++;
                        if( row == 10 ) row = 1;
                    }
                }
                if( code == 40 ) {
                    // Down arrow
                    row++;
                    if( row == 10 ) {
                        row = 1;
                        col++;
                        if( col == 10 ) col = 1;
                    }
                }
                var id = cellId( row, col );
                $( id ).focus();
            }
            else {
                var entry = code - 48;
                if( entry >=1 && entry <= 9 ) {
                    if( theGrid.toggle( cell, entry ) ) {
                        displayCell(cell);
                    }
                }
            }
        }

        var initKiller = function (killer) {

            theGrid = new Grid();

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
            initGrid: initGrid,
            nextUpdate: nextUpdate,
            finishUpdates: finishUpdates,
            retryUpdate: retryUpdate,
            testFindGroups: testFindGroups,
            highlight: highlight,
            keydown: keydown,
            initKiller: initKiller,
        };
    })();
 
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
            sudoku.initGrid( puzzles[nextPuzzle] );
            nextPuzzle++;
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
            var Killers = [[
                { total: 13, cells: [[1, 1],[2, 1]]},
                { total:  8, cells: [[1, 2], [2, 2], [2,3]] },
                { total: 15, cells: [[1, 3], [1, 4]] },
                { total: 14, cells: [[1, 5], [1, 6], [1, 7]] },
                { total:  8, cells: [[1, 8], [1, 9]] },
                { total: 39, cells: [[2, 4], [2, 5], [3, 4], [3, 5], [4, 5], [5, 5]] },
                { total: 21, cells: [[2, 6], [2, 7], [3, 6], [3, 7]] },
                { total: 23, cells: [[2, 8], [2, 9], [3, 8], [3, 9], [4, 8], [4, 9]] },
                { total: 12, cells: [[3, 1], [3, 2]] },
                { total: 10, cells: [[3, 3], [4, 3]] },
                { total: 22, cells: [[4, 1], [4, 2], [5, 1], [5, 2]] },
                { total: 10, cells: [[4, 4], [5, 3], [5, 4]] },
                { total: 22, cells: [[4, 6], [5, 6], [6, 5], [6, 6]] },
                { total: 29, cells: [[4, 7], [5, 7], [5, 8], [5, 9], [6, 9], [7, 9]] },
                { total: 14, cells: [[6, 1], [6, 2], [7, 1], [8, 1]] },
                { total:  8, cells: [[6, 3], [6, 4]] },
                { total: 22, cells: [[6, 7], [6, 8], [7, 8]] },
                { total: 16, cells: [[7, 2], [8, 2]] },
                { total: 18, cells: [[7, 3], [7, 4], [8, 4]] },
                { total: 23, cells: [[7, 5], [7, 6], [7, 7], [8, 5], [9, 5], [9, 6]] },
                { total: 23, cells: [[8, 3], [9, 1], [9, 2], [9, 3], [9, 4]] },
                { total:  9, cells: [[8, 6], [8, 7], [9, 7]] },
                { total: 26, cells: [[8, 8], [8, 9], [9, 8], [9, 9]] },
                ],
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
            if (nextKiller >= Killers.length) {
                nextKiller = 0;
            }
            let killer = gridToKiller(Killers[nextKiller]);
            sudoku.initKiller(killer);
            nextKiller++;
        }

        var addCellToKiller = function (killerSpec,r,c,cells) {
            cells.push([r, c]);
            // find next column in this row
            // cage continues with "L"
            if (c + 1 <= 9 && killerSpec[r - 1][c] == "L") {
                addCellToKiller(killerSpec, r, c+1, cells);
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

        var gridToKiller = function(killerSpec) {
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
                            addCellToKiller(killerSpec,r,c,cells);
                            let cage = {
                                total: total,
                                cells: cells
                            }
                            killer.push(cage);
                        } else if (!["L", "R", "U", "D"].includes(value)) {
                            alert("Cell["+r+","+c+"] has invalid value "+value);
                        }
                    }
                }
            } else {
                killer = killerSpec;
            }
            return killer;
        }

        return {
            getKiller: getKiller
        };
    })();

    // puzzles.getPuzzle();
    killers.getKiller();

    $("table.fixed td").on('click', function(e) {
        sudoku.highlight(e);
    });
    $("table.fixed td").on('focus', function(e) {
        sudoku.highlight(e);
    });
    $("table.fixed td").on('keydown', function(e) {
        sudoku.keydown(e);
    });
    $("table.fixed p").on('keydown', function(e) {
        sudoku.keydown(e);
    });

    $('#getPuzzle').on('click', function () {
        puzzles.getPuzzle();
    });
    $('#getKiller').on('click', function () {
        killers.getKiller();
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