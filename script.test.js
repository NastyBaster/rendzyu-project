// --- MOCK SETUP ---
// We create dummy versions of the variables and elements that script.js needs to run without crashing.

// Mock Firebase config variables
const firebaseConfigTest = {};
const firebaseConfigProd = {};

// Mock the Firebase library itself
const firebase = {
  initializeApp: () => ({ name: 'mock-app' })
};

// By assigning them to the 'global' object, we make them available to other scripts.
global.firebaseConfigTest = firebaseConfigTest;
global.firebaseConfigProd = firebaseConfigProd;
global.firebase = firebase;

// --- NEW MOCK FOR THE CANVAS ---
// We need to simulate the HTML canvas element before script.js runs.
// We create a fake canvas with a fake getContext function.
const mockCanvas = {
  getContext: () => ({
    // We can add fake drawing functions here if our tests ever need them
  }),
  width: 0,
  height: 0
};
// We also need to mock the document.getElementById function itself.
document.getElementById = () => mockCanvas;


// --- ACTUAL TESTS ---
// Now that ALL mocks are set up, we can safely import our functions.
const { createBoard, checkWinner, BOARD_SIZE } = require('./script.js');

describe('createBoard function', () => {
  test('should create a board of the correct size (BOARD_SIZE x BOARD_SIZE)', () => {
    const board = createBoard();
    expect(board.length).toBe(BOARD_SIZE);
    expect(board[0].length).toBe(BOARD_SIZE);
  });

  test('should create a board filled with null values', () => {
    const board = createBoard();
    expect(board[5][5]).toBeNull();
    expect(board[0][14]).toBeNull();
  });
});

// --- New Test Suite for checkWinner ---
describe('checkWinner function', () => {

  // RED: Write a failing test for a horizontal win
  test('should return true for a horizontal win (5 in a row)', () => {
    // 1. Setup: Create a board and place stones
    const board = createBoard(); // Start with an empty board
    const y = 7; // The row where the win will happen
    const winningColor = 'black';

    // Place 5 stones horizontally
    for (let x = 3; x < 8; x++) {
      board[y][x] = winningColor;
    }

    // 2. Define the last move that created the win
    const lastMove = { x: 7, y: y, color: winningColor };

    // 3. Assertion: Expect the function to return true
    expect(checkWinner(board, lastMove)).toBe(true);
  });

});

// Add these three new tests

test('should return true for a vertical win (5 in a row)', () => {
  const board = createBoard();
  const x = 5;
  const winningColor = 'white';
  for (let y = 2; y < 7; y++) {
    board[y][x] = winningColor;
  }
  const lastMove = { x: x, y: 6, color: winningColor };
  expect(checkWinner(board, lastMove)).toBe(true);
});

test('should return true for a diagonal win (top-left to bottom-right)', () => {
  const board = createBoard();
  const winningColor = 'black';
  for (let i = 0; i < 5; i++) {
    board[3 + i][4 + i] = winningColor;
  }
  const lastMove = { x: 8, y: 7, color: winningColor };
  expect(checkWinner(board, lastMove)).toBe(true);
});

test('should return true for an anti-diagonal win (top-right to bottom-left)', () => {
  const board = createBoard();
  const winningColor = 'white';
  for (let i = 0; i < 5; i++) {
    board[6 - i][2 + i] = winningColor;
  }
  const lastMove = { x: 2, y: 6, color: winningColor };
  expect(checkWinner(board, lastMove)).toBe(true);
});