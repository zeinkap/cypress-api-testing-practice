const { faker } = require("@faker-js/faker");

Cypress.Commands.add("generatePosts", () => {
  cy.writeFile("cypress/fixtures/faker-posts.json", {
    "posts": Cypress._.times(3, () => {
      return {
        userId: faker.datatype.number({ max: 10 }),
        id: faker.datatype.number({ max: 10 }),
        title: `${faker.company.catchPhrase()}`,
        body: `${faker.lorem.sentences(2)}`,
      };
    }),
  });
});

Cypress.Commands.add("generateSingleComment", () => {
  const postId = faker.datatype.number({ max: 10 })
  const id = faker.datatype.number({ max: 10 })
  const name = faker.name.fullName();
  const email = faker.internet.email();
  const body = faker.lorem.paragraph();

  const comment = {
    postId,
    id,
    name,
    email,
    body
  };

  cy.writeFile("cypress/fixtures/faker-comment.json", comment);
});
