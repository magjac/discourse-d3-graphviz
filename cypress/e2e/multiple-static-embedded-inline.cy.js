describe('Inline rendering', () => {

  it('renders multiple static graphs embedded in text inline', () => {
    const spanTexts = [
      'Second line: This is a graph: ',
      'aabba->b',
      ', this is another graph: ',
      'aabba->bcca->c',
      '. Those were the graphs.',
    ];
    const title = 'Cypress testing: Multiple embedded static inline';
    cy.startApplicationAndLogInAsCypressUser();
    cy.deleteCypressTestingTopic(title);
    cy.createNewTopic(title, 'First line\nSecond line: This is a graph: [dot]digraph {a -> b}[/dot], this is another graph: [dot]digraph{a -> b a -> c}[/dot]. Those were the graphs.\nThird line');
    cy.getCooked().then(cooked => {
      cy.wrap(cooked).should('have.length', 1);
      cy.wrap(cooked).find('text').should('have.text', 'ababc');
      cy.wrap(cooked).invoke('text').then(text => text.replace(/\n/g, ''))
        .should('eq',
                'First line' +
                spanTexts.join('') +
                'Third line'
               );
      cy.wrap(cooked).findParagraphs().then(paragraphs => {
        cy.wrap(paragraphs).should('have.length', 1);
        cy.wrap(paragraphs).findSpans().then(spans => {
          cy.wrap(spans).should('have.length', 5);
          for (let i = 0; i < spanTexts.length; i++) {
            cy.wrap(spans).eq(i).invoke('text').then(text => text.replace(/\n/g, ''))
              .should('eq', spanTexts[i]);
          }
        });
        cy.wrap(paragraphs).findGraphvizContainers().then(graphvizContainers => {
          cy.wrap(graphvizContainers).should('have.length', 2);
          cy.wrap(graphvizContainers).eq(0).findGraph().then(graph => {
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
          cy.wrap(graphvizContainers).eq(1).findGraph().then(graph => {
            cy.wrap(graph).should('have.length', 1);
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
