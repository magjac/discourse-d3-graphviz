describe('Inline rendering', () => {

  const topBarHeight = 60;
  const scroll = -(topBarHeight + 10);

  afterEach(() => {
    cy.getStopButtons()
      .click({multiple: true, force: true });
  })

  it('renders multiple animated graphs inline', () => {
    const spanTexts = [
      'Second line: ' +
        'This is an animated graph: ',
      'aabba->b',
      ', this is another animated graph: ',
      'aabba->bcca->c',
      '. Those were the animated graphs.',
    ];
    cy.visit('http://localhost:3000/t/multiple-embedded-animated-inline/37');
    cy.getCooked().then(cooked => {
      cy.wrap(cooked).should('have.length', 1);
      cy.wrap(cooked).find('text').should('have.text', 'ababc');
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

          cy.wrap(graphvizContainers).eq(0)
            .scrollIntoView({offset: {top: scroll, left: 0}})
            .findGraph().then(graph => {
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
          }).then(() => {cy.log('Done checking first graph')}); // Forces wait

          cy.wrap(graphvizContainers).eq(1)
            .scrollIntoView({offset: {top: scroll, left: 0}})
            .findGraph().then(graph => {
            cy.wrap(graph).should('have.length', 1);
            cy.wrap(graph).findGraph0Group().then(graph0group => {
              cy.wrap(graph0group).should('have.length', 1);
              cy.wrap(graph0group).findNodes().should('have.length', 3);
              cy.wrap(graph0group).findEdges().should('have.length', 2);
              cy.wrap(graph).invoke('text').then(text => text.replace(/\n/g, ''))
                .should('eq', 'aabba->bcca->c');
              cy.wrap(graph0group).findNodes().should('have.length', 3);
              cy.wrap(graph0group).findEdges().should('have.length', 3);
              cy.wrap(graph).invoke('text').then(text => text.replace(/\n/g, ''))
                .should('eq', 'aabba->bcca->cb->c');
            });
          }).then(() => {cy.log('Done checking second graph')});
        });
      });
    });
  })

})
