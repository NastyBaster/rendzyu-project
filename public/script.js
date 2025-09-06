// ===============================================
// SCRIPT.JS - ФІНАЛЬНА ВЕРСІЯ З ВИПРАВЛЕННЯМ ПРИЄДНАННЯ
// ===============================================

// --- ЛОГІКА ВИБОРУ СЕРЕДОВЩА ---
const isDevelopment = window.location.hostname === 'rendzyu-test.web.app' || window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const activeConfig = isDevelopment ? firebaseConfigTest : firebaseConfigProd;

// --- ІНІЦІАЛІЗАЦІЯ FIREBASE ---
const app = firebase.initializeApp(activeConfig);
console.log(`Firebase is running in ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode.`);
const db = firebase.database();

// ... (всі DOM елементи, константи та GAME STATE залишаються без змін) ...
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
const guestNameModalOverlay = document.getElementById('guest-name-modal-overlay');
const guestNameForm = document.getElementById('guest-name-form');
const guestNameInput = document.getElementById('guest-name-input');
const openGamesList = document.getElementById('open-games-list');
const BOARD_SIZE = 15;
const WINNING_LENGTH = 5;
canvas.width = 600;
canvas.height = 600;
const CELL_SIZE = canvas.width / BOARD_SIZE;
let localPlayer = { uid: null, name: 'Guest' };
let currentGameId = null;
let gameUnsubscribe = null;
let openGamesUnsubscribe = null;
let myRole = null;

// ... (всі PURE LOGIC та UI & DRAWING функції залишаються без змін) ...
function createBoard() { return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null)); }
function checkWinner(board, lastMove) {
  const { x, y, color } = lastMove;
  const countStones = (dx, dy) => {
    let count = 0;
    for (let i = 1; i < WINNING_LENGTH; i++) {
      const newX = x + i * dx; const newY = y + i * dy;
      if (newX >= 0 && newX < BOARD_SIZE && newY >= 0 && newY < BOARD_SIZE && board[newY][newX] === color) { count++; } else { break; }
    }
    return count;
  };
  if (countStones(1, 0) + countStones(-1, 0) + 1 >= WINNING_LENGTH) return true;
  if (countStones(0, 1) + countStones(0, -1) + 1 >= WINNING_LENGTH) return true;
  if (countStones(1, 1) + countStones(-1, -1) + 1 >= WINNING_LENGTH) return true;
  if (countStones(1, -1) + countStones(-1, 1) + 1 >= WINNING_LENGTH) return true;
  return false;
}
function convertFirebaseBoardToArray(firebaseBoard) {
  if (!firebaseBoard) return createBoard();
  const newBoard = createBoard();
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (firebaseBoard[y] && firebaseBoard[y][x]) { newBoard[y][x] = firebaseBoard[y][x]; }
    }
  }
  return newBoard;
}
function drawBoard() {
  ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
  for (let i = 0; i < BOARD_SIZE; i++) {
    ctx.beginPath(); ctx.moveTo(CELL_SIZE * (i + 0.5), CELL_SIZE * 0.5); ctx.lineTo(CELL_SIZE * (i + 0.5), canvas.height - CELL_SIZE * 0.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CELL_SIZE * 0.5, CELL_SIZE * (i + 0.5)); ctx.lineTo(canvas.width - CELL_SIZE * 0.5, CELL_SIZE * (i + 0.5)); ctx.stroke();
  }
}
function drawStones(board) {
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'; ctx.shadowBlur = 4; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2;
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const stone = board[y][x];
      if (stone) {
        const canvasX = CELL_SIZE * (x + 0.5); const canvasY = CELL_SIZE * (y + 0.5); const radius = CELL_SIZE * 0.4;
        ctx.beginPath(); ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2); ctx.fillStyle = stone; ctx.fill();
      }
    }
  }
  ctx.shadowColor = 'transparent';
}
function redraw(board) { ctx.clearRect(0, 0, canvas.width, canvas.height); drawBoard(); if (board) drawStones(board); }
function showWinnerModal(winner) { winnerMessage.textContent = winner === 'draw' ? 'It\'s a Draw!' : `${winner.toUpperCase()} wins!`; modalOverlay.classList.remove('hidden'); }
function resizeCanvas() {
  const container = document.body; const size = Math.min(container.clientWidth, container.clientHeight) * 0.9;
  canvas.style.width = `${size}px`; canvas.style.height = `${size}px`;
}
function showView(viewName) {
  lobbyContainer.classList.add('hidden'); joinGameScreen.classList.add('hidden'); gameContainer.classList.add('hidden');
  document.body.removeAttribute('data-view');
  if (viewName === 'lobby') { lobbyContainer.classList.remove('hidden'); document.body.setAttribute('data-view', 'lobby'); }
  else if (viewName === 'join') { joinGameScreen.classList.remove('hidden'); document.body.setAttribute('data-view', 'join'); }
  else if (viewName === 'game') { gameContainer.classList.remove('hidden'); document.body.setAttribute('data-view', 'game'); resizeCanvas(); }
}

// ===============================================
// FIREBASE & GAME FLOW
// ===============================================
async function createGame() {
  if (!localPlayer.uid) { alert("Please enter a guest name first!"); return; }
  createGameBtn.disabled = true;
  try {
    const gameId = Math.floor(100 + Math.random() * 900).toString();
    const gameRef = db.ref(`games/${gameId}`);
    const newGameData = { board: createBoard(), currentPlayer: 'black', isGameOver: false, winner: null, players: { black: { uid: localPlayer.uid, name: localPlayer.name }, white: null }, status: 'waiting', moveCount: 0 };
    await gameRef.set(newGameData);
    const openGameRef = db.ref(`open_games/${gameId}`);
    await openGameRef.set({ creatorName: localPlayer.name, creatorUid: localPlayer.uid, createdAt: firebase.database.ServerValue.TIMESTAMP });
    console.log(`Game created with ID: ${gameId}`);
    window.location.hash = `game/${gameId}`;
  } catch (error) { console.error("Error creating game:", error); alert("Could not create game."); }
  finally { createGameBtn.disabled = false; }
}

async function joinGame(gameId) {
  if (!localPlayer.uid) { alert("Please enter a guest name first!"); return; }
  const gameRef = db.ref(`games/${gameId}`);
  const openGameRef = db.ref(`open_games/${gameId}`);
  try {
    // Використовуємо транзакцію для безпечного приєднання
    await gameRef.transaction((gameData) => {
      if (gameData && gameData.status === 'waiting' && !gameData.players.white) {
        gameData.players.white = { uid: localPlayer.uid, name: localPlayer.name };
        gameData.status = 'in_progress';
        return gameData;
      }
      return; // Скасовуємо транзакцію, якщо місце зайняте
    });
    await openGameRef.remove();
    console.log(`Successfully joined game: ${gameId}`);
    if (window.location.hash !== `#game/${gameId}`) {
      window.location.hash = `game/${gameId}`;
    }
  } catch (error) { console.error("Error joining game:", error); alert("Could not join the game."); }
}

function joinAndSyncGame(gameId) {
  if (gameUnsubscribe) gameUnsubscribe();
  currentGameId = gameId;

  const gameBoardCanvas = document.getElementById('game-board');
  const waitingMessage = document.getElementById('waiting-message');

  const gameRef = db.ref(`games/${gameId}`);
  gameUnsubscribe = gameRef.on('value', (snapshot) => {
    if (!snapshot.exists()) {
      resetGame();
      alert("The game was closed or does not exist.");
      return;
    }
    const gameData = snapshot.val();
    
    // *** ОСЬ ГОЛОВНЕ ВИПРАВЛЕННЯ ***
    // Перевіряємо, чи можемо ми приєднатися до цієї гри
    const isPlayer1 = gameData.players.black && gameData.players.black.uid === localPlayer.uid;
    const isPlayer2 = gameData.players.white && gameData.players.white.uid === localPlayer.uid;
    
    if (gameData.status === 'waiting' && !isPlayer1) {
      // Якщо гра чекає, і ми не є першим гравцем, ми повинні приєднатися
      joinGame(gameId);
      // Ми не будемо нічого малювати зараз, бо після joinGame дані оновляться і цей слухач спрацює знову
      return; 
    }

    if (gameData.status === 'waiting') {
      waitingMessage.style.display = 'block';
      gameBoardCanvas.style.display = 'none';
    } else {
      waitingMessage.style.display = 'none';
      gameBoardCanvas.style.display = 'block';

      const board = convertFirebaseBoardToArray(gameData.board);
      myRole = isPlayer1 ? 'black' : (isPlayer2 ? 'white' : 'spectator');
      redraw(board);
      
      if (gameData.isGameOver) {
        showWinnerModal(gameData.winner);
      }
    }
  });
  showView('game');
}

function handleBoardClick(event) {
  if (!currentGameId) return;
  const gameRef = db.ref(`games/${currentGameId}`);
  gameRef.once('value', (snapshot) => {
    const gameData = snapshot.val();
    if (!gameData || gameData.isGameOver || gameData.status === 'waiting' || gameData.currentPlayer !== myRole) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
    const canvasX = (event.clientX - rect.left) * scaleX; const canvasY = (event.clientY - rect.top) * scaleY;
    const x = Math.floor(canvasX / CELL_SIZE); const y = Math.floor(canvasY / CELL_SIZE);
    const board = convertFirebaseBoardToArray(gameData.board);
    if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && !board[y][x]) {
      const newBoard = board.map(row => [...row]);
      newBoard[y][x] = gameData.currentPlayer;
      const lastMove = { x, y, color: gameData.currentPlayer };
      const updates = { board: newBoard, moveCount: gameData.moveCount + 1, currentPlayer: gameData.currentPlayer === 'black' ? 'white' : 'black' };
      if (checkWinner(newBoard, lastMove)) { updates.isGameOver = true; updates.winner = gameData.currentPlayer; }
      else if (updates.moveCount === BOARD_SIZE * BOARD_SIZE) { updates.isGameOver = true; updates.winner = 'draw'; }
      gameRef.update(updates);
    }
  });
}

function listenForOpenGames() {
  const openGamesRef = db.ref('open_games');
  if (openGamesUnsubscribe) openGamesUnsubscribe();
  openGamesUnsubscribe = openGamesRef.on('value', (snapshot) => {
    const games = snapshot.val();
    openGamesList.innerHTML = '';
    let gamesFound = false;
    if (games) {
      Object.entries(games).forEach(([gameId, gameData]) => {
        if (gameData.creatorUid === localPlayer.uid) return;
        gamesFound = true;
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `<span class="player-name">${gameData.creatorName}'s Game</span><button class="join-btn">Join</button>`;
        gameCard.querySelector('.join-btn').addEventListener('click', () => joinGame(gameId));
        openGamesList.appendChild(gameCard);
      });
    }
    if (!gamesFound) { openGamesList.innerHTML = '<p>Немає відкритих ігор. Створіть свою!</p>'; }
  });
}

// ===============================================
// ROUTING
// ===============================================
function handleRouting() {
  const hash = window.location.hash.slice(1);
  const [path, param] = hash.split('/');
  if (path === 'game' && param) { joinAndSyncGame(param); }
  else if (path === 'join') { showView('join'); listenForOpenGames(); }
  else { showView('lobby'); }
}

// ===============================================
// INITIALIZATION
// ===============================================
function resetGame() {
  if (gameUnsubscribe) gameUnsubscribe();
  if (openGamesUnsubscribe) openGamesUnsubscribe();
  currentGameId = null; myRole = null;
  modalOverlay.classList.add('hidden');
  redraw(createBoard());
  if (window.location.hash !== '') {
    window.location.hash = '';
  }
}

function setupApplication() {
  console.log("Setting up application event listeners...");
  const savedGuestId = sessionStorage.getItem('guestUid');
  if (savedGuestId) {
    localPlayer.uid = savedGuestId;
    const savedGuestName = sessionStorage.getItem('guestName');
    if (savedGuestName) localPlayer.name = savedGuestName;
    userNameDisplay.textContent = localPlayer.name;
    userInfo.classList.remove('hidden'); authButtons.classList.add('hidden'); gameActions.classList.remove('hidden');
  }
  
  window.addEventListener('resize', resizeCanvas);
  canvas.addEventListener('click', handleBoardClick);
  rematchBtn.addEventListener('click', resetGame);
  newGameBtn.addEventListener('click', resetGame);
  createGameBtn.addEventListener('click', createGame);

  backToLobbyBtn.addEventListener('click', () => { window.location.hash = ''; });
  joinGameBtn.addEventListener('click', () => { window.location.hash = 'join'; });

  guestBtn.addEventListener('click', () => {
    guestNameInput.value = localPlayer.name;
    guestNameModalOverlay.classList.remove('hidden');
    guestNameInput.focus();
  });

  guestNameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const guestName = guestNameInput.value.trim();
    if (guestName) {
      localPlayer.name = guestName;
      sessionStorage.setItem('guestName', guestName);
      if (!localPlayer.uid) {
        localPlayer.uid = `guest_${Date.now()}`;
        sessionStorage.setItem('guestUid', localPlayer.uid);
      }
      userNameDisplay.textContent = localPlayer.name;
      userInfo.classList.remove('hidden'); authButtons.classList.add('hidden'); gameActions.classList.remove('hidden');
      guestNameModalOverlay.classList.add('hidden');
      
      // Після введення імені, перевіряємо, чи не потрібно приєднатись до гри
      handleRouting();
    }
  });
  
  window.addEventListener('hashchange', handleRouting);
  handleRouting();
}

setupApplication();

try {
  module.exports = { createBoard, checkWinner, BOARD_SIZE };
} catch (e) {}