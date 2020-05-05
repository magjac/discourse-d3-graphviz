Cypress.Commands.add("getCooked", () => {
  return cy.get('.cooked');
});

Cypress.Commands.add("findParagraphs", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> p');
});

Cypress.Commands.add("findGraphvizContainers", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> span.graphviz-container');
});

Cypress.Commands.add("findGraph", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> svg');
});

Cypress.Commands.add("findGraph0Group", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> #graph0');
});

Cypress.Commands.add("findNode", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> #node' + index);
});

Cypress.Commands.add("findNodes", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> .node');
});

Cypress.Commands.add("findEdge", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> #edge' + index);
});

Cypress.Commands.add("findEdges", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> .edge');
});
