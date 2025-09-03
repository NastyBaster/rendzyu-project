// Поки що залишаємо цей блок порожнім. Ми заповнимо його, коли будемо налаштовувати прод.


// --- ЛОГІКА ВИБОРУ СЕРЕДОВЩА ---
// This new check works for both local servers AND for opening the file directly.
const isDevelopment = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// We determine which config to use based on the isDevelopment variable.
const activeConfig = isDevelopment ? firebaseConfigTest : firebaseConfigProd;
// --- ІНІЦІАЛІЗАЦІЯ FIREBASE ---
// Цей рядок створює активне підключення до Firebase
const app = firebase.initializeApp(activeConfig);

// Виводимо в консоль, щоб перевірити, яка конфігурація активна
console.log(`Firebase is running in ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode.`);

// Знаходимо наш canvas елемент
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');

// Встановлюємо розмір дошки
canvas.width = 600;
canvas.height = 600;

// --- STAGE 3: DRAWING ---

const CELL_SIZE = canvas.width / BOARD_SIZE;

/**
 * Draws the entire game board grid.
 */
function drawBoard() {
  // Set the style for the grid lines
  ctx.strokeStyle = '#555'; // A dark grey color for the lines
  ctx.lineWidth = 1;

  // Draw the lines
  for (let i = 0; i < BOARD_SIZE; i++) {
    // Draw vertical line
    ctx.beginPath();
    ctx.moveTo(CELL_SIZE * (i + 0.5), CELL_SIZE * 0.5);
    ctx.lineTo(CELL_SIZE * (i + 0.5), canvas.height - CELL_SIZE * 0.5);
    ctx.stroke();

    // Draw horizontal line
    ctx.beginPath();
    ctx.moveTo(CELL_SIZE * 0.5, CELL_SIZE * (i + 0.5));
    ctx.lineTo(canvas.width - CELL_SIZE * 0.5, CELL_SIZE * (i + 0.5));
    ctx.stroke();
  }
}

// --- INITIALIZATION ---
// This is the code that runs when the page first loads.
function initializeGame() {
  console.log("Initializing game visuals...");
  drawBoard();
}

// Call the initialization function to start everything.
initializeGame();

console.log("Скрипт успішно завантажено, полотно для гри готове!");
// ===============================================
// STAGE 2: GAME LOGIC
// ===============================================

// --- Game Constants ---
// Let's add some [Term: constants]. This is a [Term: best practice] because it makes the code easier to read and change later.
const BOARD_SIZE = 15;
const WINNING_LENGTH = 5;

// --- Game State ---
// This variable will hold our game board data (the matrix).
let board = createBoard();

/**
 * Creates a new, empty game board array.
 * @returns {Array<Array<null>>} A 15x15 array filled with nulls.
 */
function createBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

/**
 * Checks if the last move resulted in a win.
 * This is the function's [Term: signature] - its name and the parameters it accepts.
 * @param {Array<Array<string|null>>} currentBoard - The current state of the board.
 * @param {{x: number, y: number, color: string}} lastMove - The details of the move to check.
 * @returns {boolean} - True if the move is a winning move, otherwise false.
 */

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
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return count;
  };

  // Check Horizontally
  const horizontalCount = countStones(1, 0) + countStones(-1, 0) + 1;
  if (horizontalCount >= WINNING_LENGTH) return true;

  // Check Vertically
  const verticalCount = countStones(0, 1) + countStones(0, -1) + 1;
  if (verticalCount >= WINNING_LENGTH) return true;

  // Check Diagonally (top-left to bottom-right)
  const diagonalCount = countStones(1, 1) + countStones(-1, -1) + 1;
  if (diagonalCount >= WINNING_LENGTH) return true;

  // Check Anti-Diagonally (top-right to bottom-left)
  const antiDiagonalCount = countStones(1, -1) + countStones(-1, 1) + 1;
  if (antiDiagonalCount >= WINNING_LENGTH) return true;

  return false;
}

// --- Example Usage (for testing in the console) ---
// We can test our logic right in the browser console.
console.log("Game logic initialized. The board is ready.");
console.log(board);

// This block is only for testing purposes using Jest in Node.js
// It will be ignored by the browser.
try {
  module.exports = {
    createBoard,
    checkWinner,
    BOARD_SIZE
  };
} catch (e) {
  // This will prevent errors when running in a browser
}