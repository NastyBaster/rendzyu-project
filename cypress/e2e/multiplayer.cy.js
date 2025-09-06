// cypress/e2e/multiplayer.cy.js

describe('Full Multiplayer Game Flow', () => {
  let gameId;

  // Перед кожним тестом очищуємо базу даних
  beforeEach(() => {
    cy.task('clearGames');
    cy.visit('/');

    // Гравець 1 входить у гру
    cy.get('#guest-btn').click();
    cy.get('#guest-name-input').clear().type('Гравець 1');
    cy.get('#guest-name-form button[type="submit"]').click();
  });

  it('should allow two players to complete a full game, with Player 1 winning', () => {
    // === Етап 1: Гравець 1 створює гру ===
    cy.get('#create-game-btn').click();
    cy.contains('Очікування суперника...').should('be.visible');

    // Отримуємо ID гри з URL для подальших маніпуляцій
    cy.url().should('include', '/#game/').then((url) => {
      gameId = url.split('#game/')[1];
      cy.log(`Game ID: ${gameId}`);

      // === Етап 2: Гравець 2 приєднується до гри (симуляція через task) ===
      cy.task('joinGame', { gameId, playerName: 'Гравець 2' });
    });

    // === Етап 3: Гравець 1 перевіряє, що гра почалася, і робить перший хід ===
    cy.contains("Ваш хід, Гравець 1").should('be.visible');
    // Робимо хід у центр
    cy.get('[data-cell-id="7-7"]').click();
    cy.get('[data-cell-id="7-7"]').should('have.class', 'X');
    cy.contains('Хід суперника...').should('be.visible');

    // === Етап 4: Гравець 2 робить хід у відповідь (симуляція через task) ===
    cy.task('makeMove', { gameId, cellId: '7-8', nextTurn: 'player1' });

    // === Етап 5: Гравець 1 бачить хід суперника і готується до перемоги ===
    cy.get('[data-cell-id="7-8"]').should('have.class', 'O');
    cy.contains("Ваш хід, Гравець 1").should('be.visible');

    // Гравець 1 робить ще 4 ходи для перемоги
    cy.get('[data-cell-id="8-7"]').click(); // Хід 2 (P1)
    cy.task('makeMove', { gameId, cellId: '8-8', nextTurn: 'player1' }); // Хід 2 (P2)

    cy.get('[data-cell-id="9-7"]').click(); // Хід 3 (P1)
    cy.task('makeMove', { gameId, cellId: '9-8', nextTurn: 'player1' }); // Хід 3 (P2)

    cy.get('[data-cell-id="10-7"]').click(); // Хід 4 (P1)
    cy.task('makeMove', { gameId, cellId: '10-8', nextTurn: 'player1' }); // Хід 4 (P2)

    // === Етап 6: Гравець 1 робить переможний хід ===
    cy.get('[data-cell-id="11-7"]').click();

    // === Етап 7: Перевірка модального вікна перемоги ===
    cy.get('#modal-overlay').should('be.visible');
    cy.get('#modal-title').should('contain.text', 'Перемога!');
    cy.get('#modal-message').should('contain.text', 'Ви виграли партію!');
  });
});