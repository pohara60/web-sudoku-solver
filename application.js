/**
 * Sudoku
 */


$( document ).ready(function() {

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    window.alert = function () {
        debugger;
    }

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
        let puzzle = puzzles.getPuzzle();
        let debug = false;
        sudoku.initGrid(puzzle, '#numUpdates', debug);
        Cage.initCage(sudoku);
        Cell.initCell(sudoku);
    });
    $('#getKiller').on('click', function () {
        let killer = killers.getKiller();
        let debug = false;
        sudoku.initKiller(killer, '#numUpdates', debug);
        Cage.initCage( sudoku );
        Cell.initCell(sudoku);
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

    var toggleControls = function() {
        let killer = $("#setKiller").prop('checked');
        let sudoku = $("#setSudoku").prop('checked');
        let design = $("#setDesign").prop('checked');
        let solve = $("#setSolve").prop('checked');
        if (killer) {
            $('.killer').show();
            if (design) {
                $('.design').show();
                $('.solve').hide();
            }
            if (solve) {
                $('.design').hide();
                $('.solve').show();
            }
            $('.sudoku').hide();
        }
        if (sudoku) {
            $('.sudoku').show();
            if (design) {
                $('.design').show();
                $('.solve').hide();
            }
            if (solve) {
                $('.design').hide();
                $('.solve').show();
            }
            $('.killer').hide();
        }
    }

    $("#setKiller").click(function () {
        toggleControls();
    });
    $("#setSudoku").click(function () {
        toggleControls();
    });
    $("#setDesign").click(function () {
        toggleControls();
    });
    $("#setSolve").click(function () {
        toggleControls();
    });

    $("#setKiller").prop('checked', true);
    $("#setDesign").prop('checked', true);
    toggleControls();

    // puzzles.getPuzzle();
    //killers.getKiller();

});