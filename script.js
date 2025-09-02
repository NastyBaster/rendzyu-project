// Поки що залишаємо цей блок порожнім. Ми заповнимо його, коли будемо налаштовувати прод.


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