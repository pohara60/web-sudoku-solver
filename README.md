# web-sudoku-solver

## Class Cell
|Method|Description|
|----|-----------|
|constructor(row, col)|Construct cell|
|initPossible()|Setup array of possible values for cell|
|updatePossible()|Update possible values for cell, looking at Nonet, Row and Column|
|set value(entry)|Set or initialize cell value|
|get value()|Get cell value|
|remove(entry)|Remove entry from cell possibles|
|removeList(p)|Remove list of entries from cell possibles|
|toggle(entry)|Toggle entry for cell possibles|
|toString()|Format cell|

## Class Grid

|Properties|Description|
|----|-----------|
|updatedCells|List of updated cells to be processed|
|unknownCells|Count of unknown cells|

|Method|Description|
|----|-----------|
|constructor()|Construct grid with cells|
|setCell(row,col,entry)|Set cell entry|
|nextUpdate()|Get next updated cell to process|
|removeCell(cell,entry)|Remove entry cell from cell possibles|
|removeCellList(cell,p)|Remove list of entries from cell possibles|
|toggle(cell,entry)|Toggle entry for cell possibles|


## Global Variables

|Name|Description|
|----|-----------|
|debug|Trace execution to console|
|theGrid|The Sudoku grid|
|updateCount|Number of updates|

## Functions
|Name|Description|
|----|-----------|
|floor3(r)|Return 1, 4 or 7|
|clearFormatting()|Remove formatting from page|
|initGrid(puzzle)|Initialize grid from puzzle matrix|
|cellId(row,col)|Construct cell Id|
|displayCell(cell)|Display cell with value or possibles|
|setCell(row,col,entry)|Set cell and display it|
|unionPossible(cells)|Get union of cells possibles|
|countPossible(possible)|Count number of possibles|
|intersectPossible(p1,p2)|Get intersection of possibles|
|subtractPossible(p1,p2)|Subtract possibles|
|findGroups(pC,g,sC,f)|Find groups of "g" cells out of "pC" that have "g" possibles|
|createTestCell(poss)|Create test cell with possibles|
|testFindGroups()|Test findGroups|
|unknownCells(cells)|Return unknown cells|
|checkCellList(cell,cells)|Check for duplicate/impossible entries in cells|
|updateCellList(cell,cells,checkRow,checkCol)|Update cells for an updated cell|
|updateCellSquare(cell)|Update Nonet for an updated cell|
|updateCellRow(cell)|Update Row for an updated cell|
|updateCellColumn(cell)|Update Column for an updated cell|
|unionUpdates(union,updates)|Union updates/errors|
|updateCell(cell)|Update cell and display changes|
|nextUpdate()|Update next cell from update queue|
|finishUpdates(limit)|Perform next limit updates|
|retryUpdate()|Try updating next cell in turn|
|highlight(e)|Handle click event|
|keydown(e)|Handle keydown event|
