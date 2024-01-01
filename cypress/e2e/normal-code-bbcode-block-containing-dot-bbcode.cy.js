describe('Normal [code] inline', () => {

  it('is left untouched', () => {
    const title = 'Cypress testing: Normal code block containing dot bbcode';
    cy.startApplicationAndLogInAsCypressUser();
    cy.deleteCypressTestingTopic(title);
    cy.createNewTopic(title, '[code]\n[dot]\ndigraph {\n  a -> b\n}\n[/dot]\n[/code]');
    cy.getCooked().then(cooked => {
      cy.wrap(cooked).should('have.length', 1);
      cy.wrap(cooked).findParagraphs().should('not.exist');
      cy.wrap(cooked).find('> pre').then(pres => {
        cy.wrap(pres).should('have.length', 1);
        cy.wrap(pres).should('have.text', '[dot]\ndigraph {\n  a -> b\n}\n[/dot]');
        cy.wrap(pres).find('> code').then(codes => {
          cy.wrap(codes).should('have.length', 1);
          cy.wrap(codes).should('have.text', '[dot]\ndigraph {\n  a -> b\n}\n[/dot]');
        });
      });
    });
  })

})
