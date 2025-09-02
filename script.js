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
  // We will write the logic for this function in the next step.
  // For now, it's just an empty shell. This is our [Term: boilerplate] code.
  console.log("Checking for a winner...", lastMove); // A temporary message to see that it works
  return false;
}

// --- Example Usage (for testing in the console) ---
// We can test our logic right in the browser console.
console.log("Game logic initialized. The board is ready.");
console.log(board);