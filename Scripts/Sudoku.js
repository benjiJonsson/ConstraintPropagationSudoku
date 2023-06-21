/* 
// Sudoku Generator 
// ---------------------------------------------------------

Reference: Sudoku Creation and Grading. 
https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf
    
Similar to before, the first step is to generate a Sudoku 
board and populate it with numbers according to the laws 
of Sudoku. However, I will now use Constraint Satisfaction 
Problem: 
1. Variables: Each empty cell 
2. Domains: Numbers {1-9}
3. Constraints: No redundent numbers according to Sudoku 
Rules & according to solving rules in DEMYSTIFY. 
4. Set difficutly lvl of each puzzle according to the 
number of MUSes

The secound step is to solve the puzzle backwards to ensure
only one soltuion exsists. I have not worked out whether to 
provide the explanations during the secound or first step
*/

// Generate Algorithm 
// ----------------------------------------------------------

var generate_sudoku = function() {
  /* Initializes the generating process
  */

  // Create empty board 
  const board = create_empty_board();

  // Populate with constraint programming and backtracking 
  // Hopefully w/ DEMYSTIFY we won't need backtracking
  search(board);
  return board;
};
  
var create_empty_board = function() {
  /* Generate a Sudoku board: Array of all domains for all variables: 9x9 
  Variables w/ a set of numbers (domain) {1,2,3,4,5,6,7,8,9} expressed as a 
  string. 
  */
  const board = [];
  for (let i = 0; i < 9; i++) {
    board[i] = [];
    for (let j = 0; j < 9; j++) {
      board[i][j] = "123456789";
    }
  }
  return board;
};
  
var search = function(board) {
  /* This function initiates the functions which populate the Sudoku board.
  Steps: 1. Find next empty cell (will use heuristics) - choose variable with 
  smallest domain. 2. Test values from cell's domain to see if they are allowed
  to be placed in cell. 3. Fill vairable w/ random value from it's domain. 
  4. Remove that value from all other domain values in corresponding row, col, 
  box. 5. If cannot place fill a cell with a valid number, backtrack - both 
  that cell and associated domains.
  */

  // 1. Find empty cell
  let empty_cell = find_empty_cell(board);
  if (!empty_cell) {
    return true;
  }
  
  // Sets the row and column equal to posiiton of empty cell
  const [row, col] = empty_cell;

  // Set the domain equal to that variables domain 
  const domain = board[row][col];
  
  // Convert to array, to select one value randomly
  const domain_array = convert_to_array(domain);
  shuffle(domain_array);

  // Loop through shuffled array and test values 
  for (let num of domain_array) {

    // 2. If valid number, assigns it to to empty cell coordinates
    if (all_different(board, row, col, num)) {
      board[row][col] = num;

      // Apply elimination method (Constraint Propagation) - remove chosen
      // value from domains of cells in same row, column, and 3x3 box.
      elimination_method(board, row, col, num);
  
      // At every step of adding new number, print board to see working of 
      // algorithm - eventually will also print explanations here.
      console.log("Step:");
      printBoard(board);

      // After each 'all_different' and 'elimination_method' check, search fucntion 
      // is called recursively with updated board. If true => board is complete. 
      if (search(board)) {
        return true;
      }
        
      // If false, it means we are stuck. Undo previous choice - reset cells domain 
      // and restore the removed value from associated cells domains. 
      restoration_method(board, row, col, num);
      board[row][col] = domain;
    }
  }
  
  return false;
};
  
var printBoard = function(board) {
  /* Displays each of 9 row arrays to view board.
  */
  for (let row of board) {
    console.log(row);
  }
}
  
var find_empty_cell = function(board) {
  /* Simple fucntion to find next emptry cell sequentially
  */
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (typeof board[i][j] === "string") {
        return [i, j];
      }
    }
  }
  return null;
};
  
var convert_to_array = function(string) {
  /* Converts string to array. 
  */
  return string.split("").map(Number);
};
  
var shuffle = function (array) {
  /* Randomises the order of numbers in array. 
  */
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
  
var all_different = function(board, row, col, num) {
  /* This function checks that every value placed into an empty cell 
  adheres to the allDifferent principles of Sudoku, which are (for now)
  that every value in each row, col., box, must be a different value from 
  1-9. When using DEMYSTIFY API, the constraints that need to be satisfied 
  will be expanded. 
  */

  // Check if number is already present in row or column. 
  // If it is, return false. 
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }
  
  // Create a frameowrk to allow the algorithm to view the 3x3 box.
  const grid_row = Math.floor(row / 3) * 3;
  const grid_col = Math.floor(col / 3) * 3;
  
  // Check if number is already present in 3x3 box. 
  // If it is return false.
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[grid_row + i][grid_col + j] === num) {
        return false;
      }
    }
  }
  
  // NB - This is the first place where I will make a call to the DEMYSTIFY API. 
  // This will allow the algorithm to set more constraints at each check, which 
  // will provide more detailed explanations when explaining why a number could 
  // not be placed in a cell during the generation process. 

  // If checks pass return true.
  return true;
}
  
var elimination_method = function(board, row, col, num) {
  /* Constraint Propagation: everytime a new number is entered into a cell, 
  this algorithm  will remove that number from each cell in the 'chosen' cells 
  row, col., box. 
  */

  // Convert number back into a string. 
  const numString = num.toString();
  
  // Removing number from corresponding row and column. 
  // But, first the loop checks if 1. cell is a string (i.e., domain and hasn't 
  // been assinged a number) 2. that the domain includes the number (it could've 
  // already been removed) 3. the string has more than one number - ensures we do 
  // not remove numbers from cells where domain is 1.
  for (let i = 0; i < 9; i++) {
    if (typeof board[row][i] === "string" && board[row][i].length >1) {
      board[row][i] = board[row][i].replace(numString, "");
    }
    if (typeof board[i][col] === "string" && board[i][col].length >1) {
      board[i][col] = board[i][col].replace(numString, "");
    }
  }
  
  // Create a frameowrk to allow the algorithm to view the 3x3 box.
  const grid_row = Math.floor(row / 3) * 3;
  const grid_col = Math.floor(col / 3) * 3;
  
  // Same approach as before but with 3x3 box. 
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        typeof board[grid_row + i][grid_col + j] === "string" 
        && board[grid_row + i][grid_col + j].length >1) {
        board[grid_row + i][grid_col + j] = 
        board[grid_row + i][grid_col + j].replace(numString, "");
      }
    }
  }

  // NB - Secound place where I will make a call to the DEMYSTIFY API.
};

  
var restoration_method = function(board, row, col, num) {
  /* This functions works in the opposite direction as the elimination method, 
  as it works to restore the values to the domains of cells which had jsut been 
  removed. 
  */

  const numString = num.toString();
  
  // If domain is a string and does not include the number, add it back to that 
  // cells domain. 
  for (let i = 0; i < 9; i++) {
    if (typeof board[row][i] === "string" && !board[row][i].includes(numString)) {
      board[row][i] += numString;
    }
    if (typeof board[i][col] === "string" && !board[i][col].includes(numString)) {
      board[i][col] += numString;
    }
  }
  
  const grid_row = Math.floor(row / 3) * 3;
  const grid_col = Math.floor(col / 3) * 3;
  
  // Same approach as before but with 3x3 box.
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        typeof board[grid_row + i][grid_col + j] === "string" &&
        !board[grid_row + i][grid_col + j].includes(numString)
      ) {
        board[grid_row + i][grid_col + j] += numString;
      }
    }
  }
};
  
// Calling the constructor function. 
const populated_board = generate_sudoku();
console.log("Final Board");
printBoard(populated_board);
  