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
canvas.width = 600;
canvas.height = 600;
const CELL_SIZE = canvas.width / BOARD_SIZE;

// ===============================================
// GAME STATE
// ===============================================
let board; // Оголошуємо змінну тут
let currentPlayer = 'black'; // Black always starts

// ===============================================
// GAME LOGIC FUNCTIONS
// ===============================================

/**
 * Creates a new, empty game board array.
 */
function createBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

/**
 * Checks if the last move resulted in a win.
 */
function checkWinner(currentBoard, lastMove) {
  // ... (код функції checkWinner залишається без змін)
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
// DRAWING FUNCTIONS
// ===============================================

/**
 * Draws the entire game board grid.
 */
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

/**
 * Draws all the stones from the board array onto the canvas.
 */
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

// ===============================================
// INTERACTION
// ===============================================

/**
 * Handles the logic when a player clicks on the board.
 * @param {MouseEvent} event - The browser's click event object.
 */
function handleBoardClick(event) {
  // This gets the position and size of the canvas on the webpage.
  const rect = canvas.getBoundingClientRect();

  // This is the formula to convert screen coordinates to canvas coordinates.
  // It correctly handles page scrolling and canvas scaling.
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Convert pixel coordinates to grid coordinates
  const x = Math.floor(mouseX / CELL_SIZE);
  const y = Math.floor(mouseY / CELL_SIZE);

  // Check if the click is within the board and the cell is empty
  if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && !board[y][x]) {
    // Place the stone in our data array
    board[y][x] = currentPlayer;

    // Check for a winner
    const lastMove = { x, y, color: currentPlayer };
    if (checkWinner(board, lastMove)) {
      // Use a timeout to allow the winning stone to be drawn before the alert
      setTimeout(() => {
        alert(`${currentPlayer.toUpperCase()} wins!`);
      }, 100);
    }

    // Switch turns
    currentPlayer = (currentPlayer === 'black') ? 'white' : 'black';

    // Update the screen
    redraw();
  }
}

// ===============================================
// INITIALIZATION
// ===============================================

/**
 * Clears the canvas and redraws the board and stones.
 * This is our main screen update function.
 */
function redraw() {
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawStones();
}

/**
 * This is the main function that runs when the page first loads.
 */
function initializeGame() {
  console.log("Game logic initialized. The board is ready.");
  board = createBoard();

  // --- Remove the temporary test stones ---
  // We don't need them anymore because we will be placing stones with clicks.

  redraw(); // Initial draw of the empty board

    // Listen for click events on the canvas
  canvas.addEventListener('click', handleBoardClick);
}

// Call the initialization function to start everything.
initializeGame();

// This block is only for testing purposes
try {
  module.exports = { createBoard, checkWinner, BOARD_SIZE };
} catch (e) {}