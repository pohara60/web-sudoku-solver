/**
 * Sudoku
 */

$(document).ready(function () {
    let killer = true;
    let design = true;
    let setValue = true;
    let currentCell = null;

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    window.alert = function () {
        debugger;
    };

    var clearFormatting = function () {
        // Undo formatting
        $(".updated").removeClass("updated");
        $(".affected").removeClass("affected");
        $(".highlight").removeClass("highlight");
        $(".error").removeClass("error");
    };

    var clearColours = function () {
        // Undo colouring
        $(".c1").removeClass("c1");
        $(".c2").removeClass("c2");
        $(".c3").removeClass("c3");
        $(".c4").removeClass("c4");
    };

    var highlight = function (e) {
        var target = e.target;
        var td = target.closest("td");
        clearFormatting();
        $(td).addClass("highlight");
        e.stopPropagation();
        let id = $(td).attr("id");
        currentCell = id;
    };

    var showMessages = function (messages) {
        var message = messages == null ? "" : messages.join("\n");
        $("#messages").val(message);
    };

    var cellId = function (row, col) {
        return "#g" + row + col;
    };

    var keydown = function (e) {
        e.stopPropagation();
        var target = e.target;
        var td = target.closest("td");
        var id = $(td).attr("id");
        var row = Number(id.substr(1, 1));
        var col = Number(id.substr(2, 1));
        var code = e.which;
        // Navigation
        if (code >= 37 && code <= 40) {
            if (code == 37) {
                // Left arrow
                col--;
                if (col == 0) {
                    col = 9;
                    row--;
                    if (row == 0) row = 9;
                }
            }
            if (code == 38) {
                // Up arrow
                row--;
                if (row == 0) {
                    row = 9;
                    col--;
                    if (col == 0) col = 9;
                }
            }
            if (code == 39) {
                // Right arrow
                col++;
                if (col == 10) {
                    col = 1;
                    row++;
                    if (row == 10) row = 1;
                }
            }
            if (code == 40) {
                // Down arrow
                row++;
                if (row == 10) {
                    row = 1;
                    col++;
                    if (col == 10) col = 1;
                }
            }
            var id = cellId(row, col);
            $(id).focus();
            currentCell = id;
        } else if (code >= 48 && code <= 57) {
            var entry = code - 48;
            if (entry >= 0 && entry <= 9) {
                if (design) {
                    grid.setCell(row, col, entry);
                } else {
                    if (setValue) {
                        sudoku.setCell(row, col, entry, true);
                    } else {
                        sudoku.toggle(row, col, entry, true);
                    }
                }
            }
            var id = cellId(row, col);
            $(td).trigger("click");
            currentCell = id;
        } else if (killer && [68, 76, 82, 85].includes(code)) {
            let entry =
                code == 68
                    ? "D"
                    : code == 76
                    ? "L"
                    : code == 82
                    ? "R"
                    : code == 85
                    ? "U"
                    : "";
            if (design) {
                grid.setCell(row, col, entry);
            }
            var id = cellId(row, col);
            $(td).trigger("click");
            currentCell = id;
        } else if (code == 8) {
            // Backspace
            if (design) {
                grid.removeCell(row, col);
            } else {
                sudoku.setCell(row, col, null, true);
            }
            $(td).trigger("click");
            currentCell = id;
        } else if (code == 80 || code == 86) {
            // P toggle possible V set value
            if (code == 80) {
                $("#setPossible").prop("checked", true);
            }
            if (code == 86) {
                $("#setValue").prop("checked", true);
            }
            toggleManual();
        } else if (code == 78) {
            // N next update
            $("#nextUpdate").trigger("click");
        } else if (code == 85) {
            // U Update possible
            $("#updatePossible").trigger("click");
        }
    };

    $("table.fixed td").on("click", function (e) {
        highlight(e);
    });
    $("table.fixed td").on("focus", function (e) {
        highlight(e);
    });
    $("table.fixed td").on("keydown", function (e) {
        keydown(e);
    });
    $("table.fixed p").on("keydown", function (e) {
        keydown(e);
    });

    var clearError = function () {};
    var showError = function (message) {
        alert(message);
    };
    var clearGrid = function () {
        clearFormatting();
        clearColours();
        grid.initGrid(killer);
        var id = cellId(1, 1);
        $(id).focus();
        currentCell = id;
    };
    var solveGrid = function (e) {
        // Check for solutions
        // let solutionCount = grid.solveGrid();
        // alert("Solution count: " + solutionCount);
        return resetGrid(e);
    };
    var resetGrid = function (e) {
        let message = "";
        if (killer) {
            let debug = false;
            sudoku.initGrid(
                "#numUpdates",
                debug,
                clearFormatting,
                clearColours,
                showMessages
            );
            Cage.initCage(sudoku);
            Cell.initCell(sudoku);
            message = grid.validateKiller();
            if (message == "") {
                sudoku.initKiller(grid.getKiller());
                return true;
            }
        } else {
            let debug = false;
            sudoku.initGrid(
                "#numUpdates",
                debug,
                clearFormatting,
                clearColours,
                showMessages
            );
            Cage.initCage(sudoku);
            Cell.initCell(sudoku);
            message = grid.validatePuzzle();
            if (message == "") {
                sudoku.initPuzzle(grid.getPuzzle());
                return true;
            }
        }
        // error
        alert(message);
        $("#labelDesign").button("toggle");
        $("#labelDesign").addClass("active");
        toggleControls();
        return false;
    };
    var getGrid = function () {
        let gridText = "";
        if (killer) {
            gridText = grid.getKillerText();
        } else {
            gridText = grid.getPuzzleText();
        }
        $("#gridText").html("<pre>" + gridText + "</pre>");
    };
    $("#clrGrid").on("click", function () {
        clearGrid();
    });
    $("#getPuzzle").on("click", function () {
        let puzzle = puzzles.getPuzzle();
        grid.setPuzzle(puzzle);
    });
    $("#getKiller").on("click", function () {
        let killer = killers.getKiller();
        grid.setKiller(killer);
    });
    $("#updatePossible").on("click", function (e) {
        var row = Number(currentCell.substr(2, 1));
        var col = Number(currentCell.substr(3, 1));
        sudoku.updateOtherPossible(row, col);
    });

    $("#nextUpdate").on("click", function () {
        sudoku.nextUpdate();
    });
    $("#retryUpdate").on("click", function () {
        sudoku.retryUpdate();
    });
    $("#undoUpdate").on("click", function () {
        // To undo must start from beginning and do one less than current updates
        resetGrid();
        var limitString = $("#limitUpdates").val();
        var limit = Number(limitString);
        sudoku.finishUpdates(limit - 1);
    });
    $("#resetUpdates").on("click", function () {
        resetGrid();
    });
    $("#finishUpdates").on("click", function () {
        var limitString = $("#limitUpdates").val();
        var limit = Number(limitString);
        sudoku.finishUpdates(limit);
    });
    $("#resetUpdates").on("click", function () {
        resetGrid();
    });
    $("#testFindGroups").on("click", function () {
        sudoku.testFindGroups();
    });

    $("#getGridText").on("click", function () {
        getGrid();
    });

    var toggleControls = function () {
        killer = $("#setKiller").prop("checked");
        let sudoku = $("#setSudoku").prop("checked");
        design = $("#setDesign").prop("checked");
        let solve = $("#setSolve").prop("checked");
        if (killer) {
            $(".killer").show();
            if (design) {
                $(".design").show();
                $(".solve").hide();
            }
            if (solve) {
                $(".design").hide();
                $(".solve").show();
            }
            $(".sudoku").hide();
        }
        if (sudoku) {
            $(".sudoku").show();
            if (design) {
                $(".design").show();
                $(".solve").hide();
            }
            if (solve) {
                $(".design").hide();
                $(".solve").show();
            }
            $(".killer").hide();
        }
    };

    $("#setKiller").click(function () {
        toggleControls();
        clearGrid();
    });
    $("#setSudoku").click(function () {
        toggleControls();
        clearGrid();
    });
    $("#setDesign").click(function () {
        toggleControls();
        clearGrid();
    });
    $("#setSolve").on("click", function (e) {
        if (solveGrid(e)) {
            toggleControls();
            $("#setValue").prop("checked", true);
            toggleManual();
            clearError();
            var id = cellId(1, 1);
            $(id).focus();
            currentCell = id;
        } else {
            return false;
        }
    });

    var toggleManual = function () {
        setValue = $("#setValue").prop("checked");
        // setPossible = $("#setPossible").prop('checked');
    };
    $("#setValue").click(function () {
        toggleManual();
    });
    $("#setPossible").click(function () {
        toggleManual();
    });

    $("#setKiller").prop("checked", true);
    $("#setDesign").prop("checked", true);
    toggleControls();

    clearGrid();
});
