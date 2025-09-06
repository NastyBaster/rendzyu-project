// vite.config.js

import { defineConfig } from 'vite';

export default defineConfig({
  // Вказуємо Vite, що корінь нашого сайту знаходиться в папці 'public'
  root: 'public',
  
  // Додаткове налаштування, щоб Vite правильно працював з коренем проєкту
  build: {
    outDir: '../dist' // Папка для збірки проєкту (необов'язково зараз, але корисно на майбутнє)
  },
  
  server: {
    // Це дозволить Vite шукати файли (напр. node_modules) у корені проєкту
    fs: {
      allow: ['..']
    }
  }
});