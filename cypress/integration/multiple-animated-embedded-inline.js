describe('Inline rendering', () => {

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
      cy.wrap(cooked).findParagraphs().then(paragraphs => {
        cy.wrap(paragraphs).should('have.length', 1);
        cy.wrap(paragraphs).findSpans().then(spans => {
          cy.wrap(spans).should('have.length', 5);
          for (let i = 0; i < spanTexts.length; i++) {
            cy.wrap(spans).eq(i).should($span => {
              expect($span.text().replace(/\n/g, '')).to.equal(spanTexts[i]);
            });
          }
        });
        cy.wrap(paragraphs).findGraphvizContainers().then(graphvizContainers => {
          cy.wrap(graphvizContainers).should('have.length', 2);

          cy.wrap(graphvizContainers).eq(0)
            .findGraph().then(graph => {
            cy.wrap(graph).should('have.length', 1);
            cy.wrap(graph).findGraph0Group().then(graph0group => {
              cy.wrap(graph0group).should('have.length', 1);

              cy.wrap(graph0group).findNodes().should('have.length', 2);
              cy.wrap(graph0group).findEdges().should('have.length', 1);
              cy.wrap(graph).should($graph => {
                expect($graph.text().replace(/\n/g, '')).to.equal('aabba->b');
              });

              cy.wrap(graph0group).findNodes().should('have.length', 3);
              cy.wrap(graph0group).findEdges().should('have.length', 2);
              cy.wrap(graph).should($graph => {
                expect($graph.text().replace(/\n/g, '')).to.equal('aabba->bcca->c');
              });
            });
          }).then(() => {cy.log('Done checking first graph')}); // Forces wait

          cy.wrap(graphvizContainers).eq(1)
            .findGraph().then(graph => {
            cy.wrap(graph).should('have.length', 1);
            cy.wrap(graph).findGraph0Group().then(graph0group => {
              cy.wrap(graph0group).should('have.length', 1);

              cy.wrap(graph0group).findNodes().should('have.length', 3);
              cy.wrap(graph0group).findEdges().should('have.length', 2);
              cy.wrap(graph).should($graph => {
                expect($graph.text().replace(/\n/g, '')).to.equal('aabba->bcca->c');
              });

              cy.wrap(graph0group).findNodes().should('have.length', 4);
              cy.wrap(graph0group).findEdges().should('have.length', 3);
              cy.wrap(graph).should($graph => {
                expect($graph.text().replace(/\n/g, '')).to.equal('aabba->bccb->cddd->b');
              });
            });
          }).then(() => {cy.log('Done checking second graph')});
        });
      });
    });
  })

})
