// --- ЛОГІКА ВИБОРУ СЕРЕДОВЩА ---
const isDevelopment = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const activeConfig = isDevelopment ? firebaseConfigTest : firebaseConfigProd;

// --- ІНІЦІАЛІЗАЦІЯ FIREBASE ---
const app = firebase.initializeApp(activeConfig);
console.log(`Firebase is running in ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode.`);

// ===============================================
// GLOBAL CONSTANTS & DOM ELEMENTS
// ===============================================
const BOARD_SIZE = 15;
const WINNING_LENGTH = 5;

const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const modalOverlay = document.getElementById('modal-overlay');
const winnerMessage = document.getElementById('winner-message');
const rematchBtn = document.getElementById('rematch-btn');
const newGameBtn = document.getElementById('new-game-btn');

canvas.width = 600;
canvas.height = 600;
const CELL_SIZE = canvas.width / BOARD_SIZE;

// ===============================================
// GAME STATE
// ===============================================
let board;
let currentPlayer = 'black';
let isGameOver = false;
let moveCount = 0;

// ===============================================
// GAME LOGIC FUNCTIONS
// ===============================================
function createBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

function checkWinner(currentBoard, lastMove) {
  const { x, y, color } = lastMove;
  const countStones = (dx, dy) => {
    let count = 0;
    for (let i = 1; i < WINNING_LENGTH; i++) {
      const newX = x + i * dx;
      const newY = y + i * dy;
      if (newX >= 0 && newX < BOARD_SIZE && newY >= 0 && newY < BOARD_SIZE) {
        if (currentBoard[newY][newX] === color) {
          count++;
        } else { break; }
      } else { break; }
    }
    return count;
  };
  const horizontalCount = countStones(1, 0) + countStones(-1, 0) + 1;
  if (horizontalCount >= WINNING_LENGTH) return true;
  const verticalCount = countStones(0, 1) + countStones(0, -1) + 1;
  if (verticalCount >= WINNING_LENGTH) return true;
  const diagonalCount = countStones(1, 1) + countStones(-1, -1) + 1;
  if (diagonalCount >= WINNING_LENGTH) return true;
  const antiDiagonalCount = countStones(1, -1) + countStones(-1, 1) + 1;
  if (antiDiagonalCount >= WINNING_LENGTH) return true;
  return false;
}

// ===============================================
// DRAWING & UI FUNCTIONS
// ===============================================
function drawBoard() {
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  for (let i = 0; i < BOARD_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(CELL_SIZE * (i + 0.5), CELL_SIZE * 0.5);
    ctx.lineTo(CELL_SIZE * (i + 0.5), canvas.height - CELL_SIZE * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CELL_SIZE * 0.5, CELL_SIZE * (i + 0.5));
    ctx.lineTo(canvas.width - CELL_SIZE * 0.5, CELL_SIZE * (i + 0.5));
    ctx.stroke();
  }
}

function drawStones() {
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const stone = board[y][x];
      if (stone) {
        const canvasX = CELL_SIZE * (x + 0.5);
        const canvasY = CELL_SIZE * (y + 0.5);
        const radius = CELL_SIZE * 0.4;
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        ctx.fillStyle = stone;
        ctx.fill();
      }
    }
  }
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function showWinnerModal(winner) {
  if (winner === 'draw') {
    winnerMessage.textContent = 'It\'s a Draw!';
  } else {
    winnerMessage.textContent = `${winner.toUpperCase()} wins!`;
  }
  modalOverlay.classList.remove('hidden');
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawStones();
}

// ===============================================
// INTERACTION
// ===============================================
function handleBoardClick(event) {
  if (isGameOver) {
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const x = Math.floor(mouseX / CELL_SIZE);
  const y = Math.floor(mouseY / CELL_SIZE);

  if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && !board[y][x]) {
    board[y][x] = currentPlayer;
    moveCount++;
    redraw();

    const lastMove = { x, y, color: currentPlayer };
    if (checkWinner(board, lastMove)) {
      isGameOver = true;
      setTimeout(() => {
        showWinnerModal(currentPlayer);
      }, 100);
    } else if (moveCount === BOARD_SIZE * BOARD_SIZE) {
      isGameOver = true;
      setTimeout(() => {
        showWinnerModal('draw');
      }, 100);
    } else {
      currentPlayer = (currentPlayer === 'black') ? 'white' : 'black';
    }
  }
}

// ===============================================
// INITIALIZATION
// ===============================================
function resetGame() {
  modalOverlay.classList.add('hidden');
  console.log("Resetting game state...");
  board = createBoard();
  currentPlayer = 'black';
  isGameOver = false;
  moveCount = 0;
  redraw();
}

function setupApplication() {
  console.log("Setting up application event listeners...");
  canvas.addEventListener('click', handleBoardClick);
  rematchBtn.addEventListener('click', resetGame);
  newGameBtn.addEventListener('click', resetGame);
  resetGame();
}

// This is the single entry point that starts our application.
setupApplication();

// This block is only for testing purposes
try {
  module.exports = { createBoard, checkWinner, BOARD_SIZE };
} catch (e) {}