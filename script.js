const HUMAN = "X";
const AI = "O";

let board = Array(9).fill("");
const statusText = document.getElementById("status");
const boardDiv = document.getElementById("board");

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function startGame() {
  boardDiv.innerHTML = "";
  board.fill("");
  statusText.innerText = "Your turn";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => humanMove(i);
    boardDiv.appendChild(cell);
  }
}

function humanMove(i) {
  if (board[i] !== "" || checkWinner(board)) return;

  board[i] = HUMAN;
  updateBoard();

  if (!checkWinner(board)) {
    const bestMove = minimax(board, AI).index;
    board[bestMove] = AI;
    updateBoard();
  }
}

function updateBoard() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.innerText = board[i];
  });

  const winner = checkWinner(board);
  if (winner) {
    statusText.innerText =
      winner === "draw" ? "It's a Draw!" : `${winner} Wins!`;
  }
}

function checkWinner(b) {
  for (let [a,b1,c] of winPatterns) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return b[a];
    }
  }
  return b.includes("") ? null : "draw";
}

/* -------- MINIMAX -------- */
function minimax(newBoard, player) {
  const empty = newBoard
    .map((v,i) => v === "" ? i : null)
    .filter(v => v !== null);

  const winner = checkWinner(newBoard);
  if (winner === HUMAN) return { score: -10 };
  if (winner === AI) return { score: 10 };
  if (winner === "draw") return { score: 0 };

  let moves = [];

  for (let i of empty) {
    let move = {};
    move.index = i;
    newBoard[i] = player;

    move.score = (player === AI)
      ? minimax(newBoard, HUMAN).score
      : minimax(newBoard, AI).score;

    newBoard[i] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === AI) {
    let bestScore = -Infinity;
    for (let m of moves) {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let m of moves) {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
  }
  return bestMove;
}

function restart() {
  startGame();
}

startGame();
