 
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
            return puzzles[nextPuzzle++];
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
            nextKiller++;
            return killer;
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
