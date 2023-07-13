/* 
// Miracle Sudoku Generator 
// ---------------------------------------------------------

The first step is to generate a Sudoku board and populate it 
with numbers according to the laws of Miracle Sudoku. 
1. Variables: Each empty cell 
2. Domains: Numbers {1-9}
3. Constraints: No redundent numbers according to Killer 
Sudoku Rules & according to solving rules in DEMYSTIFY. 
4. Set difficutly lvl of each puzzle according to the 
number of MUSes

The secound step is to solve the puzzle backwards to ensure
only one soltuion exsists. I have not worked out whether to 
provide the explanations during the secound or first step
*/

var generate_miracle = function(){
  /* Initializes the generating process
  */

  const board = create_empty_board();
  search(board);
  return board;
}

  
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
  to be placed in cell. 3. If allowed, fill in cell with chosen value. 
  4. Remove that value from all other domain values in corresponding row, col, 
  box, king move, knight move, orthogonally consecutive numbers. 5. If cannot 
  fill a cell with a valid number, backtrack - both  that cell and associated domains.
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
    if (miracle_constraints(board, row, col, num)) {
      board[row][col] = num;
  
      // Apply elimination method (Constraint Propagation) - remove chosen
      // value from domains of cells in same row, column, and 3x3 box.
      miracle_elimination(board, row, col, num);
    
      // At every step of adding new number, print board to see working of 
      // algorithm - eventually will also print explanations here.
      console.log("Step:", num);
      printBoard(board);
  
      // After each 'all_different' and 'elimination_method' check, search fucntion 
      // is called recursively with updated board. If true => board is complete. 
      if (search(board)) {
        return true;
      }
          
      // If false, it means we are stuck. Undo previous choice - reset cells domain 
      // and restore the removed value from associated cells domains. 
      // restoration_method(board, row, col, num);
      //board[row][col] = domain;
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
  var emptyCells = [];
  
  // Collect all empty cells
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (typeof board[i][j] === "string") {
        emptyCells.push([i, j]);
      }
    }
  }

  // Check if there are any empty cells
  if (emptyCells.length === 0) {
    return null; // No empty cells found
  }
  
  // Select a random empty cell
  var randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
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

var miracle_constraints = function(board, row, col, num) {
  /* This function checks that every value placed into an empty cell 
  adheres to the allDifferent constraints of Miracle Sudoku, which are 
  (for now) that every value in each row, col., box, must be a different 
  value from 1-9. Plus, Knight & King move must not containt same numbers 
  and No two orthogonally adjacent cells may contain consecutive digits.
  When using DEMYSTIFY API, the constraints will be expanded. 
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
      return false;
    }
    
    // One additional constraint 
    // No two orthogonally adjacent cells may contain consecutive digits.
    if (
      (row -1 >= 0 && (board[row -1][col] === num +1 || board[row -1][col] === num -1)) ||
      (col -1 >= 0 && (board[row][col -1] === num +1 || board[row][col -1] === num -1)) ||
      (col +1 <= 8 && (board[row][col +1] === num +1 || board[row][col +1] === num -1)) ||
      (row +1 <= 8 && (board[row +1][col] === num +1 || board[row +1][col] === num -1)) ){
      return false;
    }

  // If checks pass return true.
  return true;
}

  
var miracle_elimination = function(board, row, col, num) {

  // Convert number back into a string. 
  const numString = num.toString();
  
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
        typeof board[grid_row + i][grid_col + j] === "string" &&
        board[grid_row + i][grid_col + j].length >1) {
        board[grid_row + i][grid_col + j] = 
        board[grid_row + i][grid_col + j].replace(numString, "");
      }
    }
  }

  // Miracle Rules
  // Kings elimination
  if (row - 1 >= 0 && col - 1 >= 0 && typeof board[row - 1][col - 1] === "string" &&
    board[row - 1][col - 1].length > 1) {
    board[row - 1][col - 1] = board[row - 1][col - 1].replace(numString, "");
  } else if (row - 1 >= 0 && typeof board[row - 1][col] === "string" &&
    board[row - 1][col].length > 1) {
    board[row - 1][col] = board[row - 1][col].replace(numString, "");
  } else if (row - 1 >= 0 && col +1 <= 8 && typeof board[row -1][col +1] === "string" &&
    board[row -1][col +1].length > 1) {
    board[row -1][col +1] = board[row -1][col +1].replace(numString, "");
  } else if (col - 1 >= 0 && typeof board[row][col -1] === "string" &&
    board[row][col -1].length > 1) {
    board[row][col -1] = board[row][col -1].replace(numString, "");
  } else if (col + 1 <= 8 && typeof board[row][col +1] === "string" &&
    board[row][col +1].length > 1) {
    board[row][col +1] = board[row][col +1].replace(numString, "");
  } else if (row + 1 <= 8 && col + 1 <=8 && typeof board[row +1][col -1] === "string" &&
    board[row +1][col -1].length > 1) {
    board[row +1][col -1] = board[row +1][col -1].replace(numString, "");
  } else if (row + 1 <= 8 && typeof board[row +1][col] === "string" &&
    board[row +1][col].length > 1) {
    board[row +1][col] = board[row +1][col].replace(numString, "");
  } else if (row + 1 <= 8 && col + 1 <=8 && typeof board[row +1][col +1] === "string" &&
    board[row +1][col +1].length > 1) {
    board[row +1][col +1] = board[row +1][col +1].replace(numString, "");
  } 

  // Knights elimination 
  if (row - 2 >= 0 && col - 1 >= 0 && typeof board[row - 2][col - 1] === "string" &&
    board[row - 2][col - 1].length > 1) {
    board[row - 2][col - 1] = board[row - 2][col - 1].replace(numString, "");
  } else if (row - 2 >= 0 && col + 1 <= 8 && typeof board[row - 2][col + 1] === "string" &&
    board[row - 2][col + 1].length > 1) {
    board[row - 2][col + 1] = board[row - 2][col + 1].replace(numString, "");
  } else if (row - 1 >= 0 && col - 2 >= 0 && typeof board[row - 1][col - 2] === "string" &&
    board[row - 1][col - 2].length > 1) {
    board[row - 1][col - 2] = board[row - 1][col - 2].replace(numString, "");
  } else if (row - 1 >= 0 && col + 2 <= 8 && typeof board[row - 1][col + 2] === "string" &&
    board[row - 1][col + 2].length > 1) {
    board[row - 1][col + 2] = board[row - 1][col + 2].replace(numString, "");
  } else if (row + 1 <= 8 && col + 2 <= 8 && typeof board[row + 1][col + 2] === "string" &&
    board[row + 1][col + 2].length > 1) {
    board[row + 1][col + 2] = board[row + 1][col + 2].replace(numString, "");
  } else if (row + 2 <= 8 && col - 1 >= 0 && typeof board[row + 2][col - 1] === "string" &&
    board[row + 2][col - 1].length > 1) {
    board[row + 2][col - 1] = board[row + 2][col - 1].replace(numString, "");
  } else if (row + 2 <= 8 && col + 1 <= 8 && typeof board[row + 2][col + 1] === "string" &&
    board[row + 2][col + 1].length > 1) {
    board[row + 2][col + 1] = board[row + 2][col + 1].replace(numString, "");
  }

  // No two orthogonally adjacent cells may contain consecutive digits.
  let num_add = (num +1).toString();
  let num_minus = (num  -1).toString();
  if (row -1 >= 0 && typeof board[row -1][col] === "string" && board[row -1][col].length >1){
    board[row -1][col] = board[row -1][col].replace(num_add, "");
    board[row -1][col] = board[row -1][col].replace(num_minus, "");
  } else if (col -1 >= 0 && typeof board[row][col -1] === "string" && board[row][col -1].length >1){
    board[row][col -1] = board[row][col -1].replace(num_add, "");
    board[row][col -1] = board[row][col -1].replace(num_minus, "");
  } else if (col +1 <= 8 && typeof board[row][col +1] === "string" && board[row][col +1].length >1){
    board[row][col +1] = board[row][col +1].replace(num_add, "");
    board[row][col +1] = board[row][col +1].replace(num_minus, "");
  } else if (row +1 <= 8 && typeof board[row +1][col] === "string" && board[row +1][col].length >1){
    board[row +1][col] = board[row +1][col].replace(num_add, "");
    board[row +1][col] = board[row +1][col].replace(num_minus, "");
  }
  // NB - Secound place where I will make a call to the DEMYSTIFY API.
};



const populated_board = generate_miracle();
console.log("Final Board");
printBoard(populated_board);  
