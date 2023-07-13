/* 
// Simple Backtracking Miracle Sudoku Solver/Generator 
// ---------------------------------------------------------

Reference: Sudoku Creation and Grading. 
https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf
    
The first step is to generate a Miracle Sudoku board and 
populate it with numbers according to the laws of Sudoku: 
A filled in grid of 81 numbers (9x9) such that each number 
1 to 9 occupies each row, column and box just once.

BUT now, also three new Miracle rules: 
1. Cell's seprated by a Kings move cannot have same value
2. Cell's seprated by a Knights move cannot have same value
3. No two orthogonally adjacent cells may contain consecutive 
digits.

The secound step is to solve the puzzle backwards to ensure
only one soltuion exsists. 
*/


// Generate Fully Populated Sudoku Board
// ---------------------------------------------------------

var generate_miracle = function() {
    /* Initializes the generating process
    */

    // Create empty board
    const board = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
    ]
    
    search(board);
    return board;
};

// Test if function works by setting board equal to original Miracle Sudoku 
/*
var create_empty_board = function(){

    const board = [];
    for(let i = 0; i < 9; i++){
        board[i] = [];
        for(let j = 0; j < 9; j++){
            board[i][j] = 0;
        }
    }
    console.log("board:");
    console.log(board);
    console.log("board1:");
    console.log(board1);
    return board;
}
*/
var search = function(board) {
   // Return `true` when valid solution is found: no empty cells
   const empty_cell = find_empty_cell(board);
   if (!empty_cell) {
       return true;
   }

   // Sets the row and column equal to posiiton of empty cell
   const [row, col] = empty_cell;
   //console.log([row, col]);

    // Shuffled array -> each number to be tested is chosen at
    // random. Makes each puzzle unique and random 
    const shuffled_nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    //console.log(shuffled_nums);
    // Loops through each number in 'random order'
    for(let i = 0; i < shuffled_nums.length; i++){
        // If valid num, assigns it to to empty cell coordinates
        let num = shuffled_nums[i];
        if (all_different(board, row, col, num)){
        board[row][col] = num;

            // At every step of adding new number, print board to see working of 
            // algorithm - eventually will also print explanations here.
            //console.log("Step:");
            //printBoard(board);
  
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
    //console.log("no Solution");
    //printBoard(board);
    return false;
};

var find_empty_cell = function(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return null;
};
function all_different(board, row, col, num){
    /* Function that checks if current number is valid according
    Sudoku rules i.e, every row, column, 3x3 box must containt all
    different numbers from 1-9.
    */
    //console.log("Tested Number:");
    //console.log(num);

    // Check if the number is present in row or column
    for(let i = 0; i < 9; i++){
        if(board[row][i] === num || board[i][col] === num){
            //Want to remove that number from 
            //console.log(1);
            return false;
        }
    }

    // Check if the number is present in 3x3 box
    const grid_row = Math.floor(row/3) * 3;
    const grid_col = Math.floor(col/3) * 3;

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){ 
            if(board[grid_row + i][grid_col + j] === num){
                //console.log(2);
                return false;
            }
        }
    }

    // Miracle Rules
    // "Chess Sudoku" Constraints
    // 1. Cell's seprated by a Kings move cannot containt same value
    if(
        (row - 1 >= 0 && col - 1 >= 0 && board[row -1][col -1] === num ) ||
        (row - 1 >= 0 && board[row -1][col] === num) || 
        (row - 1 >= 0 && col +1 <= 8 && board[row -1][col +1] === num) ||
        (col - 1 >= 0 && board[row][col -1] === num) ||
        (col + 1 <= 8 && board[row][col +1] === num) ||
        (row + 1 <= 8 && col + 1 <= 8 && board[row +1][col -1] === num ) ||
        (row + 1 <= 8 && board[row +1][col] === num) ||
        (row + 1 <= 8 && col + 1 <=8 && board[row +1][col +1] === num )){
        //console.log(3);
        return false; 
      }
    
        // 2. Cell's seprated by a Knights move cannot containt same value
        if (
          (row -2 >= 0 && col -1 >= 0 && board[row -2][col -1] === num) || 
          (row -2 >= 0 && col +1 <= 8 && board[row -2][col +1] === num) || 
          (row -1 >= 0 && col -2 >= 0 && board[row -1][col -2] === num) || 
          (row -1 >= 0 && col +2 <= 8 && board[row -1][col +2] === num) || 
          (row + 1 <= 8 && col - 2 >= 0 && board[row +1][col -2] === num) || 
          (row +1 <= 8 && col +2 <= 8 && board[row +1][col +2] === num) || 
          (row +2 <= 8 && col -1 >= 0 && board[row +2][col -1] === num) || 
          (row +2 <= 8 && col +1 <= 8 && board[row +2][col +1] === num) ){
            //console.log(4);
          return false;
        }
        
        // One additional constraint 
        // No two orthogonally adjacent cells may contain consecutive digits.
        if(num === 1){
            if (
                (row -1 >= 0 && (board[row -1][col] === num +1)) ||
                (col -1 >= 0 && (board[row][col -1] === num +1)) ||
                (col +1 <= 8 && (board[row][col +1] === num +1)) ||
                (row +1 <= 8 && (board[row +1][col] === num +1)) ){
                return false;
            }
        } else if(num != 1){
            if (
                (row -1 >= 0 && (board[row -1][col] === num +1 || board[row -1][col] === num -1)) ||
                (col -1 >= 0 && (board[row][col -1] === num +1 || board[row][col -1] === num -1)) ||
                (col +1 <= 8 && (board[row][col +1] === num +1 || board[row][col +1] === num -1)) ||
                (row +1 <= 8 && (board[row +1][col] === num +1 || board[row +1][col] === num -1)) ){
                return false;
            }
        }        
    return true; 
}

function shuffle(array) {
    /* Get a randomly ordered array, using Fisher-Yates algorithm 
    */
    const shuffledArray = [...array]; // Create a copy of the array

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

var printBoard = function(board) {
    /* Displays each of 9 row arrays to view board.
    */
    for (let row of board) {
      console.log(row);
    }
}

// Calling the constructor function. 
const populated_board = generate_miracle();
console.log("Final Board");
printBoard(populated_board);
