// ==========================================================
// CYPRESS.CONFIG.JS - ФІНАЛЬНА, ВИПРАВЛЕНА ВЕРСІЯ
// ==========================================================

const { defineConfig } = require('cypress');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://rendzyu-test-default-rtdb.europe-west1.firebasedatabase.app',
});

const db = admin.database();

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      on('task', {
        clearGames() {
          return db.ref('games').remove().then(() => null);
        },
        joinGame({ gameId, playerName }) {
          const updates = {
            [`games/${gameId}/players/white`]: { name: playerName, uid: 'player2-uid' },
            [`games/${gameId}/status`]: 'in_progress',
          };
          return db.ref().update(updates).then(() => null);
        },
        makeMove({ gameId, cellId }) {
          const [y, x] = cellId.split('-').map(Number);
          
          return db.ref(`games/${gameId}`).transaction((gameData) => {
            if (gameData) {
              // *** КЛЮЧОВЕ ВИПРАВЛЕННЯ ***
              // Переконуємося, що дошка і рядок існують
              if (!gameData.board) {
                // Створюємо дошку, якщо її немає (малоймовірно, але безпечно)
                gameData.board = Array.from({ length: 15 }, () => Array(15).fill(null));
              }
              if (!gameData.board[y]) {
                gameData.board[y] = Array(15).fill(null);
              }
              
              gameData.board[y][x] = 'white'; // Гравець 2 грає білими
              gameData.currentPlayer = 'black'; // Повертаємо хід чорним
              gameData.moveCount++;
            }
            return gameData;
          }).then(() => null);
        },
        getGameData(gameId) {
          return db.ref(`games/${gameId}`).get().then(snapshot => snapshot.val());
        }
      });
    },
  },
});