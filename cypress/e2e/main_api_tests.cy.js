/// <reference types="cypress" />

describe('Jsonplaceholder API test suite', () => {
  it('test retrieving a list of all posts', () => {
    cy.api({
      method: "GET",
      url: "/posts",
    })
      .its('body')
      .then((posts) => {
        expect(posts).to.have.length(100)
        expect(posts[0]).to.have.property('userId', 1)
        expect(posts[0]).to.have.property('id', 1)
        expect(posts[0]).to.have.property('title')
        expect(posts[0]).to.have.property('body')
      })
  })

  it.only('test adding a new comment to a post', () => {
    // add a new comment
    cy.fixture('test-comment-data.json').then((comment) => {
      cy.api({
        method: "POST",
        url: "/comments",
        body: comment,
      }).then((resp) => {
        expect(resp.status).to.eq(201)
        expect(resp.body).to.have.property('postId' , 1)
        expect(resp.body).to.have.property('id', 6)
        expect(resp.body).to.have.property('name', 'Zak Test')
        expect(resp.body).to.have.property('email', 'zaktest@yahoo.com')
        expect(resp.body).to.have.property('body', 'zak body test message')
        // expect(resp.headers).to.have.property('location', 'http://my-json-server.typicode.com/zeinkap/cypress-api-testing-practice/comments/6')
        
        const commentId = resp.body.id

        // verify the new comment 
        // cy.api({
        //   method: "GET", 
        //   url: `/comments/${commentId}`,
        //   // qs: {
        //   //   commentId
        //   // }
        // }).then((resp) => {
        //   expect(resp.status).to.eq(200)
        //   expect(resp.body).to.have.property('postId' , '1')
        //   expect(resp.body).to.have.property('id', 6)
        //   expect(resp.body).to.have.property('name', 'Zak Test')
        //   expect(resp.headers).to.have.property('content-type', 'application/json; charset=utf-8')
        // })
      })
    })
  })

  it('test user object for user #2 matches the corresponding user object from the full users list', () => {
    // Get user #2
    cy.api({
      method: "GET",
      url: "/users/2",
    }).then((resp) => {
      expect(resp.status).to.eq(200)
      const userTwoData = resp.body

      // Compare user #2 data to the full users list
      cy.api({
        method: "GET",
        url: "/users",
      }).then((resp) => {
        expect(resp.status).to.eq(200)
        const secondUserFromList = resp.body[1]
        console.log(secondUserFromList)
        expect(userTwoData).to.deep.equal(secondUserFromList)
      })
    })
  })

  it("test when deleting a post, a 200 response status is returned", () => {
    cy.api({
      method: "DELETE",
      url: "/posts/1",
    })
    .then((resp) => {
      expect(resp.status).to.eq(200)
      expect(resp.body).to.be.empty

      // verify post deleted
      cy.api({
        method: "GET",
        url: "/posts/1",
      })
      .then((resp) => {
        expect(resp.status).to.eq(200)
      })
    })
  })

  it("test updating an existing post", () => {
    const updatePostData = {
      id: 1,
      title: 'foo',
      body: 'testing the body',
      userId: 1,
    }

    cy.api({
      method: 'PUT',
      url: '/posts/1',
      body: updatePostData,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('id', 1)
      expect(response.body).to.have.property('title', 'foo')
      expect(response.body).to.have.property('body', 'testing the body')
      expect(response.body).to.have.property('userId', 1)
    })
  })
})