/* 
// Simple Backtracking Sudoku Generator 
// ---------------------------------------------------------

Reference: Sudoku Creation and Grading. 
https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf
    
The first step is to generate a Sudoku board and populate 
it with numbers according to the laws of Sudoku: A filled 
in grid of 81 numbers (9x9) such that each number 1 to 9 
occupies each row, column and box just once. 

The secound step is to solve the puzzle backwards to ensure
only one soltuion exsists. 
*/


// Generate Fully Populated Sudoku Board
// ---------------------------------------------------------

var generate_sudoku = function(){
    /* Initializes the generating process
    */

    // Create empty board 
    const board = create_empty_board();

    search(board);
    return board;
}

var create_empty_board = function(){

    const board = [];
    for(let i = 0; i < 9; i++){
        board[i] = [];
        for(let j = 0; j < 9; j++){
            board[i][j] = 0;
        }
    }
    return board;
}

var search = function(board){
    /* Simple backtracking search algorithm. The function repeats 
    the same logic recursively and tries to fill in the empty cells 
    until either a valid solution is found or a contradiction is 
    encountered. If a contradiction is encountered, the function 
    backtracks and removes the previous number choice to try another.

        Finds next '0' cell -> tries to place valid number in cell. If
    successful -> move to next cell. If contradiction -> undo 
    previous choice and try another.
    */


    // Return `true` when valid solution is found: no empty cells
    const empty_cell = find_empty_cell(board);
    if (!empty_cell) {
        return true;
    }

    // Sets the row and column equal to posiiton of empty cell
    const [row, col] = empty_cell;

    // Shuffled array -> each number to be tested is chosen at
    // random. Makes each puzzle unique and random 
    const shuffled_nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // Loops through each number in 'random order'
    for (let num of shuffled_nums) {

        // If valid num, assigns it to to empty cell coordinates
        if (all_different(board, row, col, num)){
        board[row][col] = num;

            // The code calls the `search' function recursively 
            // with the updated board. If true => valid solution. 
            if (search(board)) {
                return true;
            }
            // If false, undo choice
            board[row][col] = 0;
        }
    }
    // No solution found
    return false; 
}


var find_empty_cell = function(board){
    /* Iterates through board to find next empty cell. When found
    returns cells coordinates 
    */
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(board[i][j] === 0){
                return [i, j];
            }
        }
    }
    return null;
}

function all_different(board, row, col, num){
    /* Function that checks if current number is valid according
    Sudoku rules i.e, every row, column, 3x3 box must containt all
    different numbers from 1-9.
    */

    // Check if the number is present in row or column
    for(let i = 0; i < 9; i++){
        if(board[row][i] === num || board[i][col] === num){
            //Want to remove that number from 
            return false;
        }
    }

    // Check if the number is present in 3x3 box
    const grid_row = Math.floor(row/3) * 3;
    const grid_col = Math.floor(col/3) * 3;

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){ 
            if(board[grid_row + i][grid_col + j] === num){
                return false;
            }
        }
    }
    return true; 
}

function shuffle(array) {
    /* Get a randomly ordered array, using Fisher-Yates algorithm 
    */
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

var printBoard = function(board) {
    /* Displays each of 9 row arrays to view board.
    */
    for (let row of board) {
      console.log(row);
    }
}

// Solve Sudoku Board
// -----------------------------------------------------
// Reference: https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf
// Ensuring symmetry => remove numbers that are diagonally opposite
// [2;2] & [6;6]. Need to minus 8 form chosen cell row & col. 

var solve_sudoku = function (board){

    const cells = all_sudoku_cells()

    for(let [row, col] of cells){
        if(board[row][col] != 0){
            
            const diagonal_row = 8 - row
            const diagonal_col = 8 - col

            const cell_value = board[row][col];
            const diagonal_cell_value = board[diagonal_row][diagonal_col];
            board[row][col] = 0;
            board[diagonal_row][diagonal_col] = 0;

            const solution_number = count_solutions(board);
            if (solution_number != 1){
                board[row][col] = cell_value;
                board[diagonal_row][diagonal_col] = diagonal_cell_value;
            }

        }
    }

}

var all_sudoku_cells = function(){

    // First get every cell position on Sudoku Board
    const cells = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        //let row = i
        //let col = j
        cells.push([i,j]);
      }
    }
    shuffle(cells);
    //console.log(cells);
    return cells;
}

var count_solutions = function(board){
    // Create a clone to avoid modifying the original board
    const cloned_board = JSON.parse(JSON.stringify(board));
    const solution_count = count_solutions_helper(cloned_board);
    return solution_count;
}

var count_solutions_helper = function(board){
    const empty_cell = find_empty_cell(board);
    if (!empty_cell) {
      return 1; // Found a solution
    }
    //console.log(empty_cell);
    const [row, col] = empty_cell
    let count = 0; 
  
    const shuffled_nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
    for (let num of shuffled_nums) {
      if (all_different(board, row, col, num)) {
        board[row][col] = num;
  
        count += count_solutions_helper(board);
  
        if (count > 1) {
          return count; // More than one solution found, no need to continue searching
        }
  
        board[row][col] = 0; // Undo the choice and try another number
      }
    }
  
    return count;
}
  
// Calling the constructor function. 
const populated_board = generate_sudoku();
console.log("Final Board");
printBoard(populated_board);



const initial_board = generate_sudoku();
const final_board = JSON.parse(JSON.stringify(initial_board));
solve_sudoku(final_board);
console.log("Initial Board:");
console.log(initial_board);
console.log("\nFinal Board:");
console.log(final_board);

function print_board(board) {
    for (let i = 0; i < board.length; i++) {
      if (i % 3 === 0 && i !== 0) {
        console.log("- - - - - - - - - - - -");
      }
  
      let rowString = "";
      for (let j = 0; j < board[0].length; j++) {
        if (j % 3 === 0 && j !== 0) {
          rowString += " |";
        }
        if (board[i][j] === 0) {
          rowString += " 0"; // Empty cell
        } else {
          rowString += " " + board[i][j]; // Non-empty cell
        }
      }
      console.log(rowString);
    }
  }
  
  print_board(final_board);
  console.log("_______________________");
  print_board(initial_board);



