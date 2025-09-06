// ========================================================
// ОНОВЛЕНИЙ ТЕСТ: cypress/e2e/lobby.cy.js
// ========================================================

describe('Лобі та створення гри (один гравець)', () => {

  it('повинен завантажити сторінку та відобразити лобі', () => {
    cy.visit('/');
    cy.get('h1').should('contain.text', 'Рендзю Онлайн');
    cy.get('#guest-btn').should('be.visible');
  });

  it('дозволяє користувачу увійти як гість і створити гру', () => {
    // 1. Заходимо на сайт
    cy.visit('/');
    
    // 2. Входимо як гість
    cy.get('#guest-btn').click();
    cy.get('#guest-name-modal-overlay').should('be.visible');
    cy.get('#guest-name-input').clear().type('Тестер Лобі');
    cy.get('#guest-name-form button[type="submit"]').click();
    
    // 3. Перевіряємо, що вхід успішний
    cy.get('#guest-name-modal-overlay').should('not.be.visible');
    cy.get('#user-name-display').should('contain.text', 'Тестер Лобі');
    cy.get('#create-game-btn').should('be.visible');
    
    // 4. Натискаємо "Створити гру"
    cy.get('#create-game-btn').click();

    // 5. *** КЛЮЧОВЕ ВИПРАВЛЕННЯ ***
    //    Тепер ми перевіряємо, що з'явився екран очікування,
    //    а ігрова дошка прихована.
    cy.contains('Очікування суперника...').should('be.visible');
    cy.get('#game-board').should('not.be.visible');
    cy.get('#lobby-container').should('not.be.visible');
  });
});