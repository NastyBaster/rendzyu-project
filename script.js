// Поки що залишаємо цей блок порожнім. Ми заповнимо його, коли будемо налаштовувати прод.
const firebaseConfigProd = {
  // apiKey: "...",
  // authDomain: "...",
  // ...
};

// --- СЮДИ ВСТАВТЕ ВАШУ СКОПІЙОВАНУ КОНФІГУРАЦІЮ ДЛЯ ТЕСТОВОГО ПРОЄКТУ ---
const firebaseConfigTest = {
  apiKey: "AIza...",
  authDomain: "rendzyu-test.firebaseapp.com",
  databaseURL: "https://rendzyu-test-default-rtdb.firebaseio.com",
  projectId: "rendzyu-test",
  storageBucket: "rendzyu-test.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Проста логіка для визначення, яке середовище використовувати.
// Якщо сайт запущено на локальному сервері, використовуємо тестову конфігурацію.
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const activeConfig = isDevelopment ? firebaseConfigTest : firebaseConfigProd;

// Ініціалізація Firebase (поки що ми не імпортували функції, тому цей код не буде працювати,
// але ми додамо його як основу для наступного кроку)
// import { initializeApp } from "firebase/app";
// const app = initializeApp(activeConfig);

// Виводимо в консоль, щоб перевірити, яка конфігурація активна
console.log(`Firebase is running in ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode.`);

// Знаходимо наш canvas елемент
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');

// Встановлюємо розмір дошки
canvas.width = 600;
canvas.height = 600;

console.log("Скрипт успішно завантажено, полотно для гри готове!");