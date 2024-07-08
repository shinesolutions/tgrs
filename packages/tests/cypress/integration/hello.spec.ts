describe("home", function () {
  it("displays greeting", function () {
    cy.visit("/");
    cy.get(".App").contains("Hello, John Doe!");
  });
});
