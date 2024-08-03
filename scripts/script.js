const gameBoard = (function () {
  const rows = 3;
  const boxes = 3;
  const board = [];

  const setBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < boxes; j++) {
        board[i][j] = i > 0 ? board[i-1][j] + 3 : j;
      }
    }
  }

  const getBoard = () => board;
  const updateBoard = (selectedRow, selectedCol, marker) => {
    board[selectedRow - 1][selectedCol - 1] = marker;
  };
  
  setBoard();

  return { getBoard, updateBoard, setBoard };
})();

function createPlayer (name, marker) {
  const player = { name, marker };

  const getName = () => player.name;
  const getMarker = () => player.marker;

  return { getName, getMarker };
}

function playGame () {
  const firstName = prompt("What is the first player's name?");
  const secondName = prompt("What is the second player's name?");
  const firstPlayer = createPlayer(firstName, 'X');
  const secondPlayer = createPlayer(secondName, 'O');
  const board = gameBoard.getBoard();

  const players = [firstPlayer, secondPlayer];

  let currentPlayer = players[0];

  const switchTurn = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  }

  const isWinner = () => {
    for (let i = 0; i < 3; i++) {
      if ( 
        (board[i][0] === board[i][1] && board[i][1] === board[i][2]) ||
        (board[0][i] === board[1][i] && board[1][i] === board[2][i])
      ) { 
        return true; 
      } else if (
        (board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
        (board[0][2] === board[1][1] && board[1][1] === board[2][0])
      ) {
        return true;
      }
     }
     return false;
  }

  for (let i = 0; i < 9; i++) {
    console.log(`${currentPlayer.getName()}'s turn!`);
    
    const getRow = parseInt(prompt("Enter row"));
    const getCol = parseInt(prompt("Enter column"));

    if (typeof board[getRow-1][getCol-1] === "string") {
      console.log('Space already taken!');
    } else {
      gameBoard.updateBoard(getRow, getCol, currentPlayer.getMarker());
    }

    console.table(board);

    if (isWinner()) { 
      console.log(`${currentPlayer.getName()} wins!`);
      break;
    } else if (i === 8) {
      console.log("It's a tie!");
      break;
    } else {
      switchTurn();
    }
  }
}