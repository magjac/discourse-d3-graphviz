describe('Block rendering', () => {

  it('renders multiple static graph blocks', () => {
    const title = 'Cypress testing: Two paragraphs with one static block graph in each';
    cy.startApplicationAndLogInAsCypressUser();
    cy.deleteCypressTestingTopic(title);
    cy.createNewTopic(title, '[dot]\ndigraph {\n  a -> b\n}\n[/dot]\n\n[dot]\ndigraph {\n  a -> b\n  a -> c}\n[/dot]\n');
    cy.getCooked().then(cooked => {
      cy.wrap(cooked).should('have.length', 1);
      cy.wrap(cooked).find('text').should('have.text', 'ababc');
      cy.wrap(cooked).findParagraphs().then(paragraphs => {
        cy.wrap(paragraphs).should('have.length', 2);
        cy.wrap(paragraphs).eq(0).findGraphvizContainers().then(graphvizContainers => {
          cy.wrap(graphvizContainers).should('have.length', 1);
          cy.wrap(graphvizContainers).findGraph().then(graph => {
            cy.wrap(graph).should('have.length', 1);
            cy.wrap(graph).invoke('text').then(text => text.replace(/\n/g, ''))
              .should('eq', 'aabba->b');
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
        cy.wrap(paragraphs).eq(1).findGraphvizContainers().then(graphvizContainers => {
          cy.wrap(graphvizContainers).should('have.length', 1);
          cy.wrap(graphvizContainers).findGraph().then(graph => {
            cy.wrap(graph).should('have.length', 1);
            cy.wrap(graph).invoke('text').then(text => text.replace(/\n/g, ''))
              .should('eq', 'aabba->bcca->c');
            cy.wrap(graph).findGraph0Group().then(graph0group => {
              cy.wrap(graph0group).should('have.length', 1);
              cy.wrap(graph0group).findNodes().then(nodes => {
                cy.wrap(nodes).should('have.length', 3);
              });
              cy.wrap(graph0group).findEdges().then(edges => {
                cy.wrap(edges).should('have.length', 2);
              });
            });
          });
        });
      });
    });
  })

})
