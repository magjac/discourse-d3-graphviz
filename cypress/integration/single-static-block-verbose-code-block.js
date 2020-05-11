describe('Block rendering verbose with code block', () => {

  it('preserves whitespace', () => {
    cy.visit('http://localhost:3000/t/single-static-block-code-block-verbose/47');
    cy.getCooked().then(cooked => {
      cy.wrap(cooked).should('have.length', 1);
      cy.wrap(cooked).find('text').should('have.text', 'cd');
      cy.wrap(cooked).findParagraphs().then(paragraphs => {
// FIXME: change when paragraphs with their contents removed are not left behind
//        cy.wrap(paragraphs).should('have.length', 1);
        cy.wrap(paragraphs).should('have.length', 2);
        cy.wrap(paragraphs).findSpans().then(spans => {
          cy.wrap(spans).should('have.length', 1);
        });
        cy.wrap(paragraphs).findGraphContainers().then(graphContainers => {
          cy.wrap(graphContainers).findCode()
            .should('have.text', 'digraph {\n\n  node [shape=box]\n\n\n  c -> d\n\n}\n');
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
