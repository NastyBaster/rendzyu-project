// Поки що залишаємо цей блок порожнім. Ми заповнимо його, коли будемо налаштовувати прод.
const firebaseConfig = {
  apiKey: "AIzaSyBXnor_Y2N9HFNqHI7hs8HBF2MRxJFTIq4",
  authDomain: "rendzyu-ed6bf.firebaseapp.com",
  databaseURL: "https://rendzyu-ed6bf-default-rtdb.firebaseio.com",
  projectId: "rendzyu-ed6bf",
  storageBucket: "rendzyu-ed6bf.firebasestorage.app",
  messagingSenderId: "928258814163",
  appId: "1:928258814163:web:48cbcdfaa01f9f030fe426",
  measurementId: "G-SYK9RLDKQ5"
};

// --- СЮДИ ВСТАВТЕ ВАШУ СКОПІЙОВАНУ КОНФІГУРАЦІЮ ДЛЯ ТЕСТОВОГО ПРОЄКТУ ---
const firebaseConfig = {
  apiKey: "AIzaSyA6VDoNH3Y5zuICtJiHJJhtg4iJGtxkED4",
  authDomain: "rendzyu-test.firebaseapp.com",
  databaseURL: "https://rendzyu-test-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rendzyu-test",
  storageBucket: "rendzyu-test.firebasestorage.app",
  messagingSenderId: "304020482968",
  appId: "1:304020482968:web:0de6073efcfdacda56d9ed"
};

// --- ЛОГІКА ВИБОРУ СЕРЕДОВИЩА ---
// Якщо сайт запущено локально (з вашого комп'ютера), використовуємо тестову конфігурацію.
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
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