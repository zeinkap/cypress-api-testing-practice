/// <reference types="cypress" />
/* 
- NOTE CHANGES ARE ALL FAKED AND NOT PERSISTED
- Requests are cached (1 minute)
*/

describe("Jsonplaceholder API test suite", () => {
  it("test all posts contain userId, id, title and body properties", () => {
    cy.api({
      method: "GET",
      url: "/posts",
    }).then((resp) => {
      const posts = resp.body;
      expect(resp.status).to.eq(200);
      expect(posts).to.have.length(5);
      posts.forEach((post) => {
        expect(post).to.have.property("userId");
        expect(post).to.have.property("id");
        expect(post).to.have.property("title");
        expect(post).to.have.property("body");
      });
    });
  });

  it("test all comments contain postId, id, name, email and body properties", () => {
    cy.api({
      method: "GET",
      url: "/comments",
    }).then((resp) => {
      const comments = resp.body;
      expect(resp.status).to.eq(200);
      expect(comments).to.have.length(5);

      comments.forEach((comment) => {
        expect(comment).to.have.property("postId");
        expect(comment).to.have.property("id");
        expect(comment).to.have.property("name");
        expect(comment).to.have.property("email");
        expect(comment).to.have.property("body");
      });
    });
  });

  it("test all profiles contain the expected properties", () => {
    cy.api({
      method: "GET",
      url: "/profile",
    }).then((resp) => {
      const profiles = resp.body;
      expect(resp.status).to.eq(200);
      expect(profiles).to.have.length(4);
      expect(resp.headers).to.have.property(
        "content-type",
        "application/json; charset=utf-8"
      );

      profiles.forEach((profile) => {
        expect(profile).to.have.property("id");
        expect(profile).to.have.property("name");
        expect(profile).to.have.property("username");
        expect(profile).to.have.property("email");
        expect(profile).to.have.property("address");
        expect(profile.address).to.have.property("street");
        expect(profile.address).to.have.property("suite");
        expect(profile.address).to.have.property("city");
        expect(profile.address).to.have.property("zipcode");
        expect(profile.address).to.have.property("geo");
        expect(profile.address.geo).to.have.property("lat");
        expect(profile.address.geo).to.have.property("lng");
        expect(profile).to.have.property("phone");
        expect(profile).to.have.property("website");
        expect(profile).to.have.property("company");
        expect(profile.company).to.have.property("name");
        expect(profile.company).to.have.property("catchPhrase");
        expect(profile.company).to.have.property("bs");
      });
    });
  });

  it("test adding a new post under the first user", () => {
    cy.fixture("single-post-data.json").then((post) => {
      cy.api({
        method: "POST",
        url: "/posts",
        body: post,
      }).then((resp) => {
        const respBody = resp.body;
        expect(resp.status).to.eq(201);
        expect(resp.duration).to.be.lessThan(500);
        expect(resp.headers).to.have.property(
          "location",
          "http://my-json-server.typicode.com/zeinkap/cypress-api-testing-practice/posts/6"
        );
        expect(respBody).to.have.property("userId", 1);
        expect(respBody).to.have.property("id", 6);
        expect(respBody).to.have.property(
          "title",
          "Ervin Howell's first comment!"
        );
        expect(respBody).to.have.property(
          "body",
          "Hiya all! This is my first comment in 2023!"
        );
      });
    });

    // verify post added. *Will not see the newly added post since the calls are all faked*
    cy.api({
      method: "GET",
      url: "/posts",
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      // expect(resp.body).to.have.length(6);
    });
  });

  it("test adding a new comment to a post", () => {
    // add a new comment
    cy.fixture("single-comment-data.json").then((comment) => {
      cy.api({
        method: "POST",
        url: "/comments",
        body: comment,
      }).then((resp) => {
        expect(resp.status).to.eq(201);
        const comment = resp.body;
        expect(comment).to.have.property("postId", 1);
        expect(comment).to.have.property("id", 6);
        expect(comment).to.have.property("name", "Zak Test");
        expect(comment).to.have.property("email", "zaktest@yahoo.com");
        expect(comment).to.have.property("body", "zak body test message");
        expect(resp.headers).to.have.property(
          "location",
          "http://my-json-server.typicode.com/zeinkap/cypress-api-testing-practice/comments/6"
        );
      });
    });

    // verify the added comment. *Will not see the newly added comment since the calls are all faked*
    cy.api({
      method: "GET",
      url: "/comments",
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      // expect(resp.body).to.have.length(6);
    });
  });

  it("test profile two's data matches full profiles list", () => {
    // get second profile
    cy.api({
      method: "GET",
      url: "/profile/2",
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      const profileTwo = resp.body;

      // Compare profile two's data to the full profiles list
      cy.api({
        method: "GET",
        url: "/profile",
      }).then((resp) => {
        expect(resp.status).to.eq(200);
        const secondProfileFromList = resp.body[1];
        console.log(secondProfileFromList);
        expect(profileTwo).to.deep.equal(secondProfileFromList);
      });
    });
  });

  it("test when deleting a post, a 200 response status is returned", () => {
    cy.api({
      method: "DELETE",
      url: "/posts/1",
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.be.empty;

      // verify post deleted
      cy.api({
        method: "GET",
        url: "/posts/1",
      }).then((resp) => {
        expect(resp.status).to.eq(200);
      });
    });
  });

  it("test updating an existing post", () => {
    const updatePost = {
      userId: 2,
      id: 1,
      title: "updated title",
      body: "updated body",
    };

    cy.api({
      method: "PUT",
      url: "/posts/1",
      body: updatePost,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((resp) => {
      expect(resp.status).to.equal(200);
      expect(resp.body).to.have.property("userId", 2);
      expect(resp.body).to.have.property("id", 1);
      expect(resp.body).to.have.property("title", "updated title");
      expect(resp.body).to.have.property("body", "updated body");
    });
  });
});