Cypress.Commands.add("startApplication", () => {
  cy.visit('http://localhost:4200/');
});

Cypress.Commands.add("startApplicationAndLogInAsCypressUser", () => {
  cy.startApplication();
  cy.logInAsCypressUser();
});

Cypress.Commands.add("getLogInButton", () => {
  return cy.get('.login-button');
});

Cypress.Commands.add("getLogInModal", () => {
  return cy.get('.login-modal');
});

Cypress.Commands.add("getLogInButton2", () => {
  return cy.getLogInModal().find('#login-button');
});

Cypress.Commands.add("getLogInAccountNameInput", () => {
  return cy.getLogInModal().find('#login-account-name');
});

Cypress.Commands.add("getLogInAccountPasswordInput", () => {
  return cy.getLogInModal().find('#login-account-password');
});

Cypress.Commands.add("getLogInAlert", () => {
  return cy.getLogInModal().find('#modal-alert');
});

Cypress.Commands.add("logInAsCypressUser", () => {
  cy.getLogInButton().click();
  cy.getLogInAccountNameInput().type("cypress_user");
  cy.getLogInAccountPasswordInput().type("cypress_password");
  cy.getLogInButton2().click();
  // If the log in alert shows "Please wait before trying to log in again.", apply this patch to the local discourse repo:
  //
  // diff --git a/config/site_settings.yml b/config/site_settings.yml
  // index 675f99ade1..20a3cdc849 100644
  // --- a/config/site_settings.yml
  // +++ b/config/site_settings.yml
  // @@ -2148,10 +2148,10 @@ rate_limits:
  //      min: 0
  //    max_logins_per_ip_per_hour:
  //      min: 1
  // -    default: 30
  // +    default: 3600
  //    max_logins_per_ip_per_minute:
  //      min: 1
  // -    default: 6
  // +    default: 60
  //    max_post_deletions_per_minute:
  //      min: 0
  //      default: 2

  cy.getLogInAlert().should('not.exist');
  cy.getLogInButton().should('not.exist');
});

Cypress.Commands.add("getNewTopicButton", () => {
  return cy.get('#create-topic');
});

Cypress.Commands.add("getTitleInput", () => {
  return cy.get('#reply-title');
});

Cypress.Commands.add("getEditorInput", () => {
  return cy.get('.d-editor-input');
});

Cypress.Commands.add("typeDotSrcInEditorInput", (dotSrc) => {
  const escapedDotSrc = dotSrc.replace(/{/g, '{{}').replace(/\n/g, '{enter}');
  return cy.getEditorInput().type(escapedDotSrc);
});

Cypress.Commands.add("getCreateTopicButton", () => {
  return cy.get('.create');
});

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
  return cy.wrap(subject).find('> p:visible');
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
