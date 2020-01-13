# web-sudoku-solver

## Introduction

The application let's the user Create Sudoku and Killer Sudoku puzzles, and invoke an automatic solver.
"The user may also manually solve simple Sudoku puzzles, but there is limited validation.*

## Creation

### Sudoku

Enter the digits 1 to 9 in at least 17 cells to define a Sudoku.

### Killer Sudoku

Define "cages" of cells with their associated total value, so that all cells are included in a cage, 
and the total is 9 * 45 (i.e. 405).
- Enter one or two digits in an empty cell to start a new cage with the specified total.
- Enter the letters L (Left), U (Up), R (Right), D (Down) in an empty cell to join the cell into 
the cage that includes the cell in the specified direction.
- Use Backspace in a cell to delete the cage that contains it

### Puzzle Text

The user can get a textual definition of the current puzzle. 
This can be pasted into the existing puzzles in the source code.

## Solution

### Automatic Solution

The automatic solver maintains a list of cells to examine. 
- For Sudoku puzzles this starts as the specified cells.
- For Killer Sudoku it is the total cells of the cages.

The processing proceeds as follows:
- Get the next cell to examine from the start of the list of cells to examine.
- Check the cell against its row, column and square to see if any cell in those groups can be updated.
- For Killer Sudoku, check the cell's cage to see if any cell in the cage can be updated.
- Updated cells are added to the end of the list to examine.

The Next button processes one cell.
The Finish button processes the number of cells specified by Limit Updates, or the complete list if no limit is specified.
The number of cells processed since the beginning is shown in Number of Updates.

### Manual Solution

The user may update cell values and possible values.
- The Set Value and Toggle Possible buttons specify what update is performed.
- A numerical value in a cell sets or toggles that value.
- Backspace clears a cell value.

There is some support for automating possible values:
- The Update button sets updates possible values for cells linked to the current cell.
- Backspace adds the deleted value to possible values for cells linked to the current cell.

*There is no automation of Killer Sudoku cage possible values.*

## To Do

1. Improve manual solution.
2. Implement a backtracking solver that solves the puzzle using brute force, to check for a valid puzzle.
3. Explain the solution steps as the solution progresses.
4. Let the user paste in puzzle text, so they can re-enter previously saved puzzles.
5. Generate new puzzles, rather than just have hard-coded puzzles.
6. Analyze puzzles for degree of difficulty.
