describe('Block rendering', () => {

  afterEach(() => {
    cy.getStartStopButtons().click({multiple: true });
  })

  it('renders single animated graph block', () => {
    cy.visit('http://localhost:3000/t/single-animated-block/44');
    cy.getCooked().then(cooked => {
      cy.wrap(cooked).should('have.length', 1);
      cy.wrap(cooked).find('text').should('have.text', 'ab');
      cy.wrap(cooked).findParagraphs().then(paragraphs => {
        cy.wrap(paragraphs).should('have.length', 1);
        cy.wrap(paragraphs).findSpans().then(spans => {
          cy.wrap(spans).should('have.length', 1);
          cy.wrap(spans).eq(0).invoke('text').then(text => text.replace(/\n/g, ''))
            .should('eq', 'StopRepeataabba->b');
        });
        cy.wrap(paragraphs).findGraphvizContainers().then(graphvizContainers => {
          cy.wrap(graphvizContainers).should('have.length', 1);
          cy.wrap(graphvizContainers).findGraph().then(graph => {
            cy.wrap(graph).should('have.length', 1);
            cy.wrap(graph).findGraph0Group().then(graph0group => {
              cy.wrap(graph0group).should('have.length', 1);
              cy.wrap(graph0group).findNodes().should('have.length', 2);
              cy.wrap(graph0group).findEdges().should('have.length', 1);
              cy.wrap(graph).invoke('text').then(text => text.replace(/\n/g, ''))
                .should('eq', 'aabba->b');
              cy.wrap(graph0group).findNodes().should('have.length', 3);
              cy.wrap(graph0group).findEdges().should('have.length', 2);
              cy.wrap(graph).invoke('text').then(text => text.replace(/\n/g, ''))
                .should('eq', 'aabba->bcca->c');
            });
          });
        });
      });
    });
  })

})
