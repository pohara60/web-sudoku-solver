# web-sudoku-solver

## Introduction

The application let's the user Create Sudoku and Killer Sudoku puzzles, and invoke an automatic solver.
_The user may also manually solve simple Sudoku puzzles, but there is limited validation._

## Creation

Press the New Killer or New Sudoku buttons to get the next of a hard-coded list of puzzles,
or create a puzzle manually as explained below.

### Sudoku

Enter the digits 1 to 9 in at least 17 cells to define a Sudoku.

### Killer Sudoku

Define "cages" of cells with their associated total value, so that all cells are included in a cage,
and the total is 9 \* 45 (i.e. 405).

-   Enter one or two digits in an empty cell to start a new cage with the specified total.
-   Enter the letters L (Left), U (Up), R (Right), D (Down) in an empty cell to join the cell into
    the cage that includes the cell in the specified direction.
-   Use Backspace in a cell to delete the cage that contains it

### Puzzle Text

The user can get a textual definition of the current puzzle.
This can be pasted into the existing puzzles in the source code.

## Solution

When the user presses the Solve button, the puzzle is solved with a backtracking (brute-force) solver, and the number of solutions is displayed.
(This can take 15 seconds for a Killer Sudoku!)
Then the grid is changed to the solution grid ready for manual or automatic solution. The soluton grid shows possible values for unknown cells.

### Automatic Solution

The automatic solver maintains a list of cells to examine.

-   For Sudoku puzzles this starts as the specified cells.
-   For Killer Sudoku it is the total cells of the cages.

The processing proceeds as follows:

-   Get the next cell to examine from the start of the list of cells to examine.
-   Check the cell against its row, column and square to see if any cell in those nonets can be updated.
-   For Killer Sudoku, check the cell's cage(s) to see if any cell in the cage can be updated.
-   A terse explanation of the updates is shown next to the grid.
-   Updated cells are added to the end of the list to examine.

The Next button processes one cell.
The Finish button processes the number of cells specified by Limit Updates, or the complete list if no limit is specified.
The number of cells processed since the beginning is shown in Number of Updates.
The Reset button restarts the solution from the beginning.
The Undo button restarts the solution from the beginning, and processes one less than the current Number of Updates,
to get to the state before the last update.

#### Highlighting

The current updated cell is highlighted with bold text. If it is not changed, it has turquoise text, otherwise green text.
Other cells that are affected are highlighted with green text.
Any error cells are highlighted with red text (this should not happen with automatic solution).

#### Virtual Cages

For Killer Sudoku, the solver computes additional _virtual_ cages, by examining every group of adjacent rows, columns and squares, and constructing cages for the cells that do not appear in the cages that are completely included in the group.
For example, if row 1 has two completely included cages for columns 1-4 and 6-8, then a virtual cage is constructed for the cells in columns 5 and 9, with total of 45 less the sum of the two included cages.

Each virtual cage normally has a corresponding _extra_ cage that includes the other cells from the cages that include the virtual cage cells.
In the example above, the two cages that include columns 5 and 9 of row 1 have additional cells that form an extra virtual cage with total of the sum of the cages less the virtual cage in row 1.

Normal puzzle cages have unique values in the cells.
However, if a virtual cage is not completely included in a square, row or column then the values in the cage are non-unique.

The explanation text identifies cages with their:

-   total
-   the number of cells
-   a flag r for real or v for virtual
-   a flag u for unique or d for duplicate values
-   the cell locations, including ranges of rows or columns
-   the source of a virtual cell, which may be flagged x for extra

For example:

```
    cage 16[5]vu: [1,2][4,2][7-9,2] (col 1 x)
```

identifies a virtual, unique cage of total 16, with 5 cells in column 2, created with the extra cells from non-included cages in column 1.

### Manual Solution

The user may update cell values and possible values.

-   The Set Value and Toggle Possible buttons specify what update is performed.
-   A numerical value in a cell sets or toggles that value.
-   Backspace clears a cell value.

There is some support for automating possible values:

-   The Update button updates the possible values for cells linked to the current cell.
-   Backspace adds the deleted value to possible values for cells linked to the current cell.

_There is no automation of Killer Sudoku cage possible values._

## To Do

1. Improve manual solution.
2. Let the user paste in puzzle text, so they can re-enter previously saved puzzles.
3. Generate new puzzles, rather than just have hard-coded puzzles.
4. Analyze puzzles for degree of difficulty.
