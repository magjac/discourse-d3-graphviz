describe('Block rendering', () => {

  it('renders single static graph block verbose with blank lines within the DOT source code', () => {
    const title = 'Cypress testing: Single static block verbose with blank lines within';
    cy.startApplicationAndLogInAsCypressUser();
    cy.deleteCypressTestingTopic(title);
    cy.createNewTopic(title, '[dot verbose=true]\ndigraph {\n\nnode [shape=box]\n\na -> b\n\n}\n[/dot]');
    cy.getCooked().then(cooked => {
      cy.wrap(cooked).should('have.length', 1);
      cy.wrap(cooked).find('text').should('have.text', 'ab');
      cy.wrap(cooked).findParagraphs().then(paragraphs => {
        cy.wrap(paragraphs).should('have.length', 1);
        cy.wrap(paragraphs).findSpans().then(spans => {
          cy.wrap(spans).should('have.length', 1);
        });
        cy.wrap(paragraphs).findGraphContainers().then(graphContainers => {
          cy.wrap(graphContainers).findCode()
            .should('have.text', 'digraph {\n\nnode [shape=box]\n\na -> b\n\n}\n');
        });
        cy.wrap(paragraphs).findGraphvizContainers().then(graphvizContainers => {
          cy.wrap(graphvizContainers).should('have.length', 1);
          cy.wrap(graphvizContainers).findGraph().then(graph => {
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
