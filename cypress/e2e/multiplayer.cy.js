// ====================================================================
// ПЕРЕМОЖНИЙ ТЕСТ
// ====================================================================

describe('Повний ігровий цикл мультиплеєра', () => {
  let gameId;

  beforeEach(() => {
    cy.task('clearGames');
    cy.visit('/');
    cy.get('#guest-btn').click();
    cy.get('#guest-name-input').clear().type('Гравець 1');
    cy.get('#guest-name-form button[type="submit"]').click();
  });

  it('дозволяє створити гру, приєднатися іншому гравцю і завершити партію', () => {
    // Етап 1: Створення гри
    cy.get('#create-game-btn').click();
    cy.url().should('include', '#game/');

    // Етап 2: Отримуємо ID гри і виконуємо ВСІ наступні дії всередині .then()
    cy.url().then((url) => {
      gameId = url.split('#game/')[1];
      cy.log(`ID гри отримано: ${gameId}`);
      expect(gameId).to.not.be.empty;

      // Етап 3: Приєднуємо Гравця 2
      cy.task('joinGame', { gameId, playerName: 'Гравець 2' });

      // Етап 4: Чекаємо на початок гри
      cy.get('#game-board').should('be.visible');

      // Етап 5: Симуляція переможної партії
      cy.get('#game-board').click(300, 210);
      cy.task('getGameData', gameId).its('moveCount').should('eq', 1);

      cy.task('makeMove', { gameId, cellId: '0-0' });
      cy.task('getGameData', gameId).its('moveCount').should('eq', 2);
      
      cy.get('#game-board').click(300, 250);
      cy.task('getGameData', gameId).its('moveCount').should('eq', 3);

      cy.task('makeMove', { gameId, cellId: '0-1' });
      cy.task('getGameData', gameId).its('moveCount').should('eq', 4);

      cy.get('#game-board').click(300, 290);
      cy.task('getGameData', gameId).its('moveCount').should('eq', 5);

      cy.task('makeMove', { gameId, cellId: '0-2' });
      cy.task('getGameData', gameId).its('moveCount').should('eq', 6);
      
      cy.get('#game-board').click(300, 330);
      cy.task('getGameData', gameId).its('moveCount').should('eq', 7);

      cy.task('makeMove', { gameId, cellId: '0-3' });
      cy.task('getGameData', gameId).its('moveCount').should('eq', 8);

      cy.get('#game-board').click(300, 370);
      cy.task('getGameData', gameId).its('winner').should('eq', 'black');

      // Етап 6: Перевірка модального вікна перемоги
      cy.get('#winner-modal').should('be.visible');
      
      // *** ФІНАЛЬНЕ ВИПРАВЛЕННЯ ***
      cy.get('#winner-message').should('contain.text', 'BLACK wins!');
    });
  });
});