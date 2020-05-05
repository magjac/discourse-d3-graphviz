describe('Inline rendering', () => {

  it('renders single static graph inline', () => {
    cy.visit('http://localhost:3000/t/single-static-inline/33');
    cy.get('.cooked').find('text').should('have.text', 'ab');
    cy.getCooked().then(cooked => {
      cy.wrap(cooked).should('have.length', 1);
      cy.wrap(cooked).findParagraphs().then(paragraphs => {
        cy.wrap(paragraphs).should('have.length', 1);
        cy.wrap(paragraphs).findGraphContainers().then(graphContainers => {
          cy.wrap(graphContainers).should('have.length', 1);
          cy.wrap(graphContainers).findGraph().then(graph => {
            cy.wrap(graph).should('have.length', 1);
            cy.wrap(graph).findGraph0Group().then(graph0group => {
              cy.wrap(graph0group).should('have.length', 1);
              cy.wrap(graph0group).findNodes().then(nodes => {
                cy.wrap(nodes).should('have.length', 2);
              });
              cy.wrap(graph0group).findEdges().then(edges => {
                cy.wrap(edges).should('have.length', 1);
              });
            });
          });
        });
      });
    });
  })

})