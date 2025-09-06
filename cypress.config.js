// cypress.config.js

const { defineConfig } = require('cypress');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

// Ініціалізація Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Вставте сюди URL вашої Realtime Database
  databaseURL: 'https://rendzyu-test-default-rtdb.europe-west1.firebasedatabase.app',
});

const db = admin.database();

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Переконайтеся, що порт правильний
    setupNodeEvents(on, config) {
      on('task', {
        // Завдання для очищення бази даних перед тестом
        clearGames() {
          return db.ref('games').remove().then(() => null);
        },

        // Завдання для симуляції приєднання Гравця 2 до гри
        joinGame({ gameId, playerName }) {
          const updates = {
            [`games/${gameId}/player2`]: { name: playerName, uid: 'player2-uid' },
            [`games/${gameId}/status`]: 'playing',
            [`games/${gameId}/currentTurn`]: 'player1', // Гра починається з ходу гравця 1
          };
          return db.ref().update(updates).then(() => null);
        },

        // Завдання для симуляції ходу Гравця 2
        makeMove({ gameId, cellId, nextTurn }) {
          const updates = {
            [`games/${gameId}/board/${cellId}`]: 'O', // Гравець 2 грає "O"
            [`games/${gameId}/currentTurn`]: nextTurn,
          };
          return db.ref().update(updates).then(() => null);
        },
      });
    },
  },
});