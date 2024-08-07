const gameBoard = (function () {
  const rows = 3;
  const boxes = 3;
  const board = [];

  const setBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < boxes; j++) {
        board[i][j] = '';
      }
    }
  }
  
  setBoard();

  const getBoard = () => board;
  const updateBoard = (selectedRow, selectedCol, marker) => {
    board[selectedRow][selectedCol] = marker;
  };

  return { getBoard, updateBoard, setBoard };
})();

function createPlayer (name, marker) {
  const player = { name, marker };

  const getName = () => player.name;
  const getMarker = () => player.marker;

  return { getName, getMarker };
}

const displayController = (function () {
  const firstPlayerName = document.querySelector('#player1');
  const secondPlayerName = document.querySelector('#player2');
  const playerForm = document.querySelector('#playForm');
  const boxes = document.querySelectorAll('.box');
  const messageDisplay = document.querySelector('.messageHeader');
  const currentBoard = gameBoard.getBoard();
  const startPlay = document.querySelector('.startPlay');
  const playAgainBtn = document.querySelector('.playAgainBtn');
  const restartBtn = document.querySelector('.resetBtn');
  
  const getBoxes = () => boxes;

  const turnMessage = (name, marker) => {
    messageDisplay.textContent = `${name}'s turn!`;
    messageDisplay.classList.toggle(marker);
  } 

  const toggleForm = () => {
    startPlay.classList.toggle('hidden');
  }

  const togglePlayAgain = () => {
    playAgainBtn.classList.toggle('hidden');
  }

  const toggleRestartBtn = () => {
    restartBtn.classList.toggle('hidden');
  }

  const resultMessage = (result) => {
    if (result === 'win') {
      messageDisplay.textContent = `${gameController.getCurrentPlayer().getName()} wins!`;
    } else {
      messageDisplay.textContent = `It's a ${result}!`;
    }
  }

  const toggleBoard = () => {
    boxes.forEach((box) => {
      box.classList.toggle('hidden');
    });
  }

  const renderBoard = () => {
    boxes.forEach((box) => {
      if (currentBoard[box.dataset.row][box.dataset.column]) {
        box.textContent = currentBoard[box.dataset.row][box.dataset.column];
        box.classList.add(currentBoard[box.dataset.row][box.dataset.column]);
      }
    });
  }

  const resetBoard = () => {
    boxes.forEach((box) => {
      if (currentBoard[box.dataset.row][box.dataset.column]) {
        box.classList.remove(currentBoard[box.dataset.row][box.dataset.column]);
        box.textContent = '';
      }
    });
  }

  playerForm.addEventListener('submit', (e) => {
    gameController.initiateGame(firstPlayerName.value, secondPlayerName.value);
    e.preventDefault();
    playerForm.reset();
    toggleForm();
    toggleRestartBtn();
  });
  
  boxes.forEach((box) => {
    box.addEventListener('click', () => {
      const boxRow = box.dataset.row;
      const boxCol = box.dataset.column;
      gameController.playRound(boxRow, boxCol);
    });
  });

  playAgainBtn.addEventListener('click', () => {
    messageDisplay.textContent = '';
    resetBoard();
    gameBoard.setBoard();
    toggleBoard();
    toggleForm();
    togglePlayAgain();
  });

  restartBtn.addEventListener('click', () => {
    gameController.clearPlayers();
    messageDisplay.textContent = '';
    resetBoard();
    gameBoard.setBoard();
    toggleForm();
    toggleRestartBtn();
  });

  return { turnMessage, renderBoard, getBoxes, toggleBoard, resultMessage, togglePlayAgain, toggleRestartBtn };
})();

const gameController = (function () {
  const board = gameBoard.getBoard();
  const gameBoxes = displayController.getBoxes();
  
  let players = [];
  let currentPlayer = {};

  const initiateGame = (firstName, secondName) => {
    const firstPlayer = createPlayer(firstName, 'X');
    const secondPlayer = createPlayer(secondName, 'O');
    players.push(firstPlayer, secondPlayer);
    currentPlayer = players[0];
    displayTurn();
  }

  const clearPlayers = () => {
    currentPlayer = {};
    players = [];
  }

  const displayTurn = () => {
    displayController.turnMessage(currentPlayer.getName(), currentPlayer.getMarker());
  }

  const getCurrentPlayer = () => currentPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    displayTurn();
  }

  const addMarker = (row, col) => {
    if (!board[row][col]) {
      gameBoard.updateBoard(row, col, currentPlayer.getMarker());
      displayController.renderBoard();
    } else {
      switchTurn();
    }
  }

  const endGame = (result) => {
    setTimeout(() => {
      displayController.resultMessage(result);
      displayController.toggleBoard();
      displayController.togglePlayAgain();
      displayController.toggleRestartBtn();
      clearPlayers();
    }, 250);
  }
  
  const playRound = (row, col) => {
    addMarker(row, col);
    const gameOver = isGameOver(gameBoxes);
    gameOver ? endGame(gameOver) : switchTurn();
  }

  const isGameOver = (boxes) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    
    const boxText = [];

    boxes.forEach((box) => {
      boxText.push(box.textContent);
    });

    let winner = '';

    for (let combo of winningCombos) {
      if (
        (boxes[combo[0]].textContent === boxes[combo[1]].textContent) 
          && 
        (boxes[combo[1]].textContent === boxes[combo[2]].textContent)
          && 
        (boxes[combo[0]].textContent !== '')
      ) {
        winner = 'win';
      }
    }
    
    if (winner) {
      return winner;
    } else if (boxText.includes('')) {
      return false;
    } else {
      return 'tie';
    }

  }

  return { initiateGame, playRound, getCurrentPlayer, clearPlayers };
})();
