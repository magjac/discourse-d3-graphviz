describe('Block rendering', () => {

  const dotSrcTexts = [
    'digraph {\n  a -> b\n}\n',
    'digraph {\n  a -> b\n  a -> c\n}\n',
    'digraph {\n  a -> c\n  a -> b\n}\n',
  ];
  const graphTexts = [
    '\n\n\n\n\na\n\na\n\n\n\nb\n\nb\n\n\n\na->b\n\n\n\n\n\nc\n\nc\n\n\n\na->c\n\n\n\n\n',
  ];

  afterEach(() => {
    cy.getStopButtons()
      .click({multiple: true, force: true });
  })

  it('renders single animated graph block', () => {
    const title = 'Cypress testing: Single animated block code verbose';
    cy.startApplicationAndLogInAsCypressUser();
    cy.deleteCypressTestingTopic(title);
    let text = '';
    for (const dotSrcText of dotSrcTexts) {
      text += `[dot verbose=true]\n[code]\n${dotSrcText}\n[/code]\n[/dot]\n`;
    }
    cy.createNewTopic(title, text);
    cy.getCooked().then(cooked => {
      cy.wrap(cooked).should('have.length', 1);
      cy.wrap(cooked).find('text').should('have.text', 'ab');
      cy.wrap(cooked).findParagraphs().then(paragraphs => {
        cy.wrap(paragraphs).should('have.length', 1);
        cy.wrap(paragraphs).findSpans().then(spans => {
          cy.wrap(spans).should('have.length', 1);
        });
        cy.wrap(paragraphs).findGraphContainers().then(graphContainers => {
          cy.wrap(graphContainers).should('have.length', 1);
          cy.wrap(graphContainers).findCode()
            .should('have.text', dotSrcTexts.join('\n'));
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
