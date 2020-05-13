describe('Normal [code] inline', () => {

  it('is left untouched', () => {
    cy.visit('http://localhost:3000/t/normal-code-bbcode-inline-containing-dot-bbcode/51');
    cy.getCooked().then(cooked => {
      cy.wrap(cooked).should('have.length', 1);
      cy.wrap(cooked).findParagraphs().should('not.exist');
      cy.wrap(cooked).find('> pre').then(pres => {
        cy.wrap(pres).should('have.length', 1);
        cy.wrap(pres).should('have.text', ' [dot] digraph {a -> b} [/dot] ');
        cy.wrap(pres).find('> code').then(codes => {
          cy.wrap(codes).should('have.length', 1);
          cy.wrap(codes).should('have.text', ' [dot] digraph {a -> b} [/dot] ');
        });
      });
    });
  })

})
