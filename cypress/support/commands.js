Cypress.Commands.add("getCooked", () => {
  return cy.get('.cooked');
});

Cypress.Commands.add("findStopButtons", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('button#stop-button');
});

Cypress.Commands.add("getStopButtons", () => {
  return cy.getCooked().findStopButtons();
});

Cypress.Commands.add("findParagraphs", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> p');
});

Cypress.Commands.add("findSpans", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> span');
});

Cypress.Commands.add("findGraphContainers", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('span.graph-container');
});

Cypress.Commands.add("findGraphvizContainers", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('span.graphviz-container');
});

Cypress.Commands.add("findCode", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('pre > code');
});

Cypress.Commands.add("findGraph", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('svg');
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
