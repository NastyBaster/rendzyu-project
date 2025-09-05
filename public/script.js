// --- ЛОГІКА ВИБОРУ СЕРЕДОВЩА ---
const isDevelopment = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const activeConfig = isDevelopment ? firebaseConfigTest : firebaseConfigProd;

// --- ІНІЦІАЛІЗАЦІЯ FIREBASE ---
const app = firebase.initializeApp(activeConfig);
console.log(`Firebase is running in ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode.`);
const db = firebase.database();

// ===============================================
// DOM ELEMENTS
// ===============================================
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const modalOverlay = document.getElementById('modal-overlay');
const winnerMessage = document.getElementById('winner-message');
const rematchBtn = document.getElementById('rematch-btn');
const newGameBtn = document.getElementById('new-game-btn');
const lobbyContainer = document.getElementById('lobby-container');
const authButtons = document.getElementById('auth-buttons');
const guestBtn = document.getElementById('guest-btn');
const gameActions = document.getElementById('game-actions');
const createGameBtn = document.getElementById('create-game-btn');
const joinGameBtn = document.getElementById('join-game-btn');
const joinGameScreen = document.getElementById('join-game-screen');
const backToLobbyBtn = document.getElementById('back-to-lobby-btn');
const gameContainer = document.getElementById('game-container');
const userInfo = document.getElementById('user-info');
const userNameDisplay = document.getElementById('user-name-display');

// ===============================================
// GLOBAL CONSTANTS
// ===============================================
const BOARD_SIZE = 15;
const WINNING_LENGTH = 5;
canvas.width = 600;
canvas.height = 600;
const CELL_SIZE = canvas.width / BOARD_SIZE;

// ===============================================
// GAME STATE
// ===============================================
let localPlayer = { uid: null, name: 'Guest' };
let currentGameId = null;
let gameUnsubscribe = null;
let myRole = null;
let gameState = {};

// ===============================================
// PURE LOGIC FUNCTIONS
// ===============================================
function createBoard() { /* ... код ... */ }
function checkWinner(board, lastMove) { /* ... код ... */ }
function convertFirebaseBoardToArray(firebaseBoard) { /* ... код ... */ }

// ===============================================
// UI & DRAWING FUNCTIONS
// ===============================================
function drawBoard() { /* ... код ... */ }
function drawStones(board) { /* ... код ... */ }
function redraw(board) { /* ... код ... */ }
function showWinnerModal(winner) { /* ... код ... */ }

function resizeCanvas() {
  const container = document.body;
  const size = Math.min(container.clientWidth, container.clientHeight) * 0.9;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
}

function showView(viewName) {
  lobbyContainer.classList.add('hidden');
  joinGameScreen.classList.add('hidden');
  gameContainer.classList.add('hidden');

  document.body.removeAttribute('data-view');

  if (viewName === 'lobby') {
    lobbyContainer.classList.remove('hidden');
    document.body.setAttribute('data-view', 'lobby');
  } else if (viewName === 'join') {
    joinGameScreen.classList.remove('hidden');
    document.body.setAttribute('data-view', 'join');
  } else if (viewName === 'game') {
    gameContainer.classList.remove('hidden');
    document.body.setAttribute('data-view', 'game');
    resizeCanvas();
  }
}

// ===============================================
// FIREBASE & GAME FLOW
// ===============================================
async function createGame() { /* ... код ... */ }
function joinAndSyncGame(gameId) { /* ... код ... */ }
function handleBoardClick(event) { /* ... код ... */ }

// ===============================================
// INITIALIZATION
// ===============================================
function resetGame() { /* ... код ... */ }

function setupApplication() {
  console.log("Setting up application event listeners...");
  const savedGuestId = sessionStorage.getItem('guestUid');
  if (savedGuestId) {
    localPlayer.uid = savedGuestId;
    const savedGuestName = sessionStorage.getItem('guestName');
    if (savedGuestName) localPlayer.name = savedGuestName;
  }
  
  window.addEventListener('resize', resizeCanvas);
  canvas.addEventListener('click', handleBoardClick);
  rematchBtn.addEventListener('click', resetGame);
  newGameBtn.addEventListener('click', resetGame);
  createGameBtn.addEventListener('click', createGame);
  guestBtn.addEventListener('click', () => {
    const guestName = prompt("Please enter your name to play as a guest:", localPlayer.name);
    if (guestName) {
      localPlayer.name = guestName;
      sessionStorage.setItem('guestName', guestName);
      if (!localPlayer.uid) {
        localPlayer.uid = `guest_${Date.now()}`;
        sessionStorage.setItem('guestUid', localPlayer.uid);
      }
      userNameDisplay.textContent = localPlayer.name;
      userInfo.classList.remove('hidden');
      authButtons.classList.add('hidden');
      gameActions.classList.remove('hidden');
    }
  });
  
  resetGame();
}

setupApplication();

try {
  module.exports = { createBoard, checkWinner, BOARD_SIZE };
} catch (e) {}

// --- ТІЛА ФУНКЦІЙ (щоб не дублювати) ---
function createBoard() { return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null)); }
function checkWinner(board, lastMove) { const { x, y, color } = lastMove; const countStones = (dx, dy) => { let count = 0; for (let i = 1; i < WINNING_LENGTH; i++) { const newX = x + i * dx; const newY = y + i * dy; if (newX >= 0 && newX < BOARD_SIZE && newY >= 0 && newY < BOARD_SIZE && board[newY][newX] === color) { count++; } else { break; } } return count; }; const horizontalCount = countStones(1, 0) + countStones(-1, 0) + 1; if (horizontalCount >= WINNING_LENGTH) return true; const verticalCount = countStones(0, 1) + countStones(0, -1) + 1; if (verticalCount >= WINNING_LENGTH) return true; const diagonalCount = countStones(1, 1) + countStones(-1, -1) + 1; if (diagonalCount >= WINNING_LENGTH) return true; const antiDiagonalCount = countStones(1, -1) + countStones(-1, 1) + 1; if (antiDiagonalCount >= WINNING_LENGTH) return true; return false; }
function convertFirebaseBoardToArray(firebaseBoard) { if (!firebaseBoard) return createBoard(); if (Array.isArray(firebaseBoard)) return firebaseBoard; const boardArray = []; for (let y = 0; y < BOARD_SIZE; y++) { boardArray[y] = []; for (let x = 0; x < BOARD_SIZE; x++) { const cellValue = firebaseBoard[y] ? firebaseBoard[y][x] : null; boardArray[y][x] = cellValue || null; } } return boardArray; }
function drawBoard() { ctx.strokeStyle = '#555'; ctx.lineWidth = 1; for (let i = 0; i < BOARD_SIZE; i++) { ctx.beginPath(); ctx.moveTo(CELL_SIZE * (i + 0.5), CELL_SIZE * 0.5); ctx.lineTo(CELL_SIZE * (i + 0.5), canvas.height - CELL_SIZE * 0.5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(CELL_SIZE * 0.5, CELL_SIZE * (i + 0.5)); ctx.lineTo(canvas.width - CELL_SIZE * 0.5, CELL_SIZE * (i + 0.5)); ctx.stroke(); } }
function drawStones(board) { ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'; ctx.shadowBlur = 4; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2; for (let y = 0; y < BOARD_SIZE; y++) { for (let x = 0; x < BOARD_SIZE; x++) { const stone = board[y][x]; if (stone) { const canvasX = CELL_SIZE * (x + 0.5); const canvasY = CELL_SIZE * (y + 0.5); const radius = CELL_SIZE * 0.4; ctx.beginPath(); ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2); ctx.fillStyle = stone; ctx.fill(); } } } ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }
function redraw(board) { ctx.clearRect(0, 0, canvas.width, canvas.height); drawBoard(); if (board) { drawStones(board); } }
function showWinnerModal(winner) { if (winner === 'draw') { winnerMessage.textContent = 'It\'s a Draw!'; } else { winnerMessage.textContent = `${winner.toUpperCase()} wins!`; } modalOverlay.classList.remove('hidden'); }
async function createGame() { if (!localPlayer.uid) { alert("Please enter a guest name first!"); return; } try { const gameId = Math.floor(100 + Math.random() * 900).toString(); const gameRef = db.ref(`games/${gameId}`); const newGameData = { board: createBoard(), currentPlayer: 'black', isGameOver: false, winner: null, players: { black: { uid: localPlayer.uid, name: localPlayer.name }, white: null }, status: 'waiting', moveCount: 0 }; await gameRef.set(newGameData); console.log(`Game created with ID: ${gameId}`); joinAndSyncGame(gameId); } catch (error) { console.error("Error creating game:", error); alert("Could not create game."); } }
function joinAndSyncGame(gameId) { currentGameId = gameId; const gameRef = db.ref(`games/${gameId}`); if (gameUnsubscribe) gameUnsubscribe(); gameUnsubscribe = gameRef.on('value', (snapshot) => { const gameData = snapshot.val(); if (gameData) { const boardFromFirebase = convertFirebaseBoardToArray(gameData.board); gameState = { ...gameData, board: boardFromFirebase }; if (gameState.players.black && gameState.players.black.uid === localPlayer.uid) myRole = 'black'; else if (gameState.players.white && gameState.players.white.uid === localPlayer.uid) myRole = 'white'; else myRole = 'spectator'; redraw(gameState.board); if (gameState.isGameOver) showWinnerModal(gameState.winner); } }); showView('game'); }
function handleBoardClick(event) { if (!gameState || gameState.isGameOver || gameState.currentPlayer !== myRole) { if (gameState && !gameState.isGameOver) console.log("Cannot make a move. It's " + gameState.currentPlayer + "'s turn, and your role is " + myRole); return; } const rect = canvas.getBoundingClientRect(); const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height; const canvasX = (event.clientX - rect.left) * scaleX; const canvasY = (event.clientY - rect.top) * scaleY; const x = Math.floor(canvasX / CELL_SIZE); const y = Math.floor(canvasY / CELL_SIZE); if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && !gameState.board[y][x]) { const { board, currentPlayer, moveCount } = gameState; const newBoard = board.map(row => [...row]); newBoard[y][x] = currentPlayer; const lastMove = { x, y, color: currentPlayer }; const updates = { board: newBoard, moveCount: moveCount + 1, currentPlayer: currentPlayer === 'black' ? 'white' : 'black' }; if (checkWinner(newBoard, lastMove)) { updates.isGameOver = true; updates.winner = currentPlayer; updates.currentPlayer = null; } else if (updates.moveCount === BOARD_SIZE * BOARD_SIZE) { updates.isGameOver = true; updates.winner = 'draw'; updates.currentPlayer = null; } db.ref(`games/${currentGameId}`).update(updates); } }
function resetGame() { if (gameUnsubscribe) gameUnsubscribe(); currentGameId = null; myRole = null; gameState = {}; modalOverlay.classList.add('hidden'); showView('lobby'); redraw(createBoard()); }