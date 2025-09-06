describe('Lobby and Game Creation Flow', () => {

  it('should load the page and display the lobby', () => {
    cy.visit('/');
    cy.get('h1').should('contain.text', 'Рендзю Онлайн');
    cy.get('#guest-btn').should('be.visible');
  });

  it('should allow a user to log in as a guest and create a game', () => {
    cy.visit('/');
    cy.get('#guest-btn').click();
    cy.get('#guest-name-modal-overlay').should('be.visible');
    cy.get('#guest-name-input').clear().type('Cypress-Тестер');
    cy.get('#guest-name-form button[type="submit"]').click();
    cy.get('#guest-name-modal-overlay').should('not.be.visible');
    cy.get('#user-name-display').should('contain.text', 'Cypress-Тестер');
    cy.get('#create-game-btn').should('be.visible');
    cy.get('#create-game-btn').click();
    cy.get('#game-board').should('be.visible');
    cy.get('#lobby-container').should('not.be.visible');

  cy.wait(500);
  cy.get('#game-board').click(); 

    // Крок 11: Перевіряємо, що гра не "зламалася"
    cy.get('#modal-overlay').should('not.be.visible');
  });

});