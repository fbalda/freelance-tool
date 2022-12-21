const username = "TestUser";
const password = "test1";
const businessName = "Test Company GmbH";
const street = "Teststreet";
const houseNumber = "1a";
const zip = "12345";
const city = "Testington";
const phoneNumber = "+12 345 678 90";
const email = "test@test.com";
const iban = "DE12345678901234567890123456789000";
const bic = "ABCDEFGHIJ0";
const taxNumber = "12/345/67890";

const securedRoutes = ["/", "/settings", "/clients/add"];

describe("auth tests", () => {
  const login = (
    username: string,
    password: string,
    expectedStatusCode: number
  ) => {
    cy.request({
      method: "POST",
      url: "/api/login",
      failOnStatusCode: false,
      body: { username, password },
    }).then((res) => {
      expect(res.status).to.be.eq(expectedStatusCode);
    });
  };

  const validLogin = () => {
    login(username, password, 200);
  };

  it("should allow setup if there are no users", () => {
    cy.intercept(`${Cypress.config("baseUrl") || ""}/api/setup`).as("setup");

    cy.visit("/");
    cy.url().should("eq", `${Cypress.config("baseUrl") || ""}/setup`);

    // Fill out form
    cy.get('input[name="username"]')
      .type(username)
      .should("have.value", username);
    cy.get('input[name="password"]')
      .type(password)
      .should("have.value", password);
    cy.get('input[name="repeatPassword"]')
      .type(password)
      .should("have.value", password);
    cy.get('input[name="businessName"]')
      .type(businessName)
      .should("have.value", businessName);
    cy.get('input[name="street"]').type(street).should("have.value", street);
    cy.get('input[name="houseNumber"]')
      .type(houseNumber)
      .should("have.value", houseNumber);
    cy.get('input[name="zip"]').type(zip).should("have.value", zip);
    cy.get('input[name="city"]').type(city).should("have.value", city);
    cy.get('input[name="phone"]')
      .type(phoneNumber)
      .should("have.value", phoneNumber);
    cy.get('input[name="email"]').type(email).should("have.value", email);
    cy.get('input[name="iban"]').type(iban).should("have.value", iban);
    cy.get('input[name="bic"]').type(bic).should("have.value", bic);
    cy.get('input[name="taxNumber"]')
      .type(taxNumber)
      .should("have.value", taxNumber);

    cy.get('button[type="submit"]').click();
    cy.wait("@setup");

    cy.url().should("eq", `${Cypress.config("baseUrl") || ""}/login`);
  });

  it("should not allow setup if a user already exists", () => {
    cy.visit("/setup");
    cy.url().should("eq", `${Cypress.config("baseUrl") || ""}/login`);
  });

  it("should fail authentication with incorrect username", () => {
    login(username + "0", password, 403);
  });

  it("should fail authentication with incorrect password", () => {
    login(username, password + "0", 403);
  });

  it("should pass authentication with correct credentials", () => {
    validLogin();
  });

  it("should not have access to secured pages without authenticating", () => {
    securedRoutes.forEach((route) => {
      cy.log(`Visiting route '${route}'`);
      cy.visit(route);
      cy.url().should("eq", `${Cypress.config("baseUrl") || ""}/login`);
    });
  });

  it("should have access to secured pages with valid login", () => {
    validLogin();
    securedRoutes.forEach((route) => {
      cy.log(`Visiting route '${route}'`);
      cy.visit(route);
      cy.url().should("eq", `${Cypress.config("baseUrl") || ""}${route}`);
      cy.screenshot();
    });
  });
});

// To satisfy typescript
export {};
