/* 
// Simple Backtracking Sudoku Generator 
// ---------------------------------------------------------

Reference: Sudoku Creation and Grading. 
https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf

Reference: Backtracking
https://www.techwithtim.net/tutorials/python-programming/sudoku-solver-backtracking/part-2
    
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
    /* Create 2D Array: 9x9 Arrays with 
    values of 0
    */
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

    // Shuffled array -> each tested number is chosen at random. 
    const shuffled_nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // Loops through each number in 'random order'
    for (let num of shuffled_nums) {

        // If valid num, assigns it to to empty cell coordinates
        if (all_different(board, row, col, num)){
            board[row][col] = num;

            // The fucntion now recursively calls itself with the  
            // updated board to fill in next empty cell.
            if (search(board)) {
                return true;
            }
            // If false, current number has led to invalid solution. 
            // Undo choice, and tries next number in array. 
            board[row][col] = 0;
        }
    }
    // No solution found
    return false; 
}

var find_empty_cell = function(board){
    /* Iterates through board to find next empty cell. When found
    returns cells coordinates.
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

var solve_sudoku = function (board){
    /* Function to get starting board i.e. board the players will play. 
    Remove two numbers at each step and check that only one valid solution 
    exists. 

    Reference: https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf
    Ensuring symmetry => remove numbers that are diagonally opposite
    [2;2] & [6;6]. Need to minus 8 form chosen cell row & col. 
    */

    //Gets positon of every cell on the board. 
    const cells = all_sudoku_cells()

    for(let [row, col] of cells){
        if(board[row][col] != 0){
            
            // Set diagonally opposite cell postion 
            const diagonal_row = 8 - row
            const diagonal_col = 8 - col

            //Store the vlaue incase we need to backtrack and reset it 
            const cell_value = board[row][col];
            const diagonal_cell_value = board[diagonal_row][diagonal_col];

            //Set chosen cell and diagonally opposite cell equal to zero
            board[row][col] = 0;
            board[diagonal_row][diagonal_col] = 0;

            //Check how many solutions were found
            const solution_number = count_solutions(board);

            // If more than one solution is found reset the cell numbers 
            // This will also ensure a minimum of 17 cells 
            if (solution_number != 1){
                board[row][col] = cell_value;
                board[diagonal_row][diagonal_col] = diagonal_cell_value;
            }

        }
    }

}

var all_sudoku_cells = function(){
    /* Function to get position of all cells on the board.
    */

    // First get every cell position on Sudoku Board
    const cells = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        cells.push([i,j]);
      }
    }
    shuffle(cells);
    return cells;
}

var count_solutions = function(board){
    /* Function to store number of differents 
    solutions. 
    */

    // Create a clone to avoid modifying the original board
    const cloned_board = JSON.parse(JSON.stringify(board));
    const solution_count = count_solutions_helper(cloned_board);
    return solution_count;
}

var count_solutions_helper = function(board){
    /* Function to see if only one solution occures every time a number is 
    removed. Logic: after each number is removed try fill in the board same way 
    as `search` function and count how many solutions are found. 
    */

    const empty_cell = find_empty_cell(board);
    if (!empty_cell) {
      return 1; // Found a solution
    }

    const [row, col] = empty_cell
    let count = 0; 
  
    const shuffled_nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
    for (let num of shuffled_nums) {
      if (all_different(board, row, col, num)) {
        board[row][col] = num;
  
        // Recursively call itself and everytime ther are no more empty cells
        // (solution is found), it adds that value to the count variable. 
        count += count_solutions_helper(board);
        //console.log(count);
  
        if (count > 1) {
          return count; // More than one solution found, no need to continue searching
        }
  
        // If count = 1, only one soltuon is found, the funciton undoes previous choice
        // and tries to find another solution
        board[row][col] = 0;
      }
    }
  
    return count;
}

// Calling the Constructore functions  
const initial_board = generate_sudoku();
const final_board = JSON.parse(JSON.stringify(initial_board));
solve_sudoku(final_board);

// Initial board is board user would play from 
// Final board is fully generated board

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

console.log("Initial Board:");
print_board(final_board);
console.log("_______________________");
console.log("\nFinal Board:");
print_board(initial_board);


