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
const { createBoard, BOARD_SIZE } = require('./script.js');

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