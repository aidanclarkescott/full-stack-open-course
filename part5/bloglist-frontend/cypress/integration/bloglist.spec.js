describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "aidan",
      username: "aidan",
      password: "test",
    };

    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("login form is shown", function () {
    cy.contains("log in to application");
    cy.contains("username").get("#username");
    cy.contains("password").get("#password");
    cy.contains("login");
  });

  describe("login", function () {
    it("existing user can log in successfully", function () {
      cy.get("#username").type("aidan");
      cy.get("#password").type("test");
      cy.contains("login").click();

      cy.contains("aidan logged in");
    });

    it("login fails with wrong password", function () {
      cy.get("#username").type("aidan");
      cy.get("#password").type("wrong");
      cy.contains("login").click();

      cy.get(".error")
        .should("contain", "Wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)");
      cy.get("html").should("not.contain", "aidan logged in");
    });
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.login({ username: "aidan", password: "test" });
    });

    it("a blog can be created", function () {
      cy.contains("create new blog").click();
      cy.get("#title").type("cypress blog");
      cy.get("#author").type("tester");
      cy.get("#url").type("www.test.com");

      cy.get("#new-blog-form").contains("create").click();
      cy.get(".notification")
        .should("contain", "a new blog cypress blog by tester added")
        .and("have.css", "color", "rgb(0, 128, 0)");

      cy.contains("cypress blog tester");
    });

    describe("and a blog exists", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "new cypress blog",
          author: "tester",
          url: "www.test.com",
        });
      });

      it("a user can like a blog", function () {
        cy.contains("new cypress blog").contains("view").click();
        cy.contains("likes: 0");
        cy.contains("like").click();
        cy.contains("likes: 1");
      });

      it("the user that created the blog can delete it", function () {
        cy.contains("new cypress blog").contains("view").click();
        cy.contains("remove").click();
        cy.get("html").should("not.contain", "new cypress blog");
      });

      it("a user that did not create the blog, cannot delete it", function () {
        cy.request("POST", "http://localhost:3003/api/users/", {
          name: "new tester",
          username: "tester2",
          password: "test2",
        });

        cy.login({ username: "tester2", password: "test2" });
        cy.contains("logout");
        cy.contains("new cypress blog").contains("view").click();
        cy.contains("new cypress blog").should("not.contain", "remove");
      });
    });

    describe("and several blogs exist", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "cypress blog 1",
          author: "tester",
          url: "www.test.com",
        });
        cy.createBlog({
          title: "cypress blog 2",
          author: "tester",
          url: "www.test.com",
        });
        cy.createBlog({
          title: "cypress blog 3",
          author: "tester",
          url: "www.test.com",
        });
      });

      it("the blogs are sorted according to likes", function () {
        cy.contains("cypress blog 1").contains("view").click();
        cy.contains("cypress blog 2").as("blog2").contains("view").click();
        cy.get("@blog2").contains("like").click();
        cy.get("@blog2").contains("likes: 1");

        cy.contains("cypress blog 3").as("blog3").contains("view").click();
        cy.get("@blog3").contains("like").click();
        cy.get("@blog3").contains("likes: 1");
        cy.get("@blog3").contains("like").click();
        cy.get("@blog3").contains("likes: 2");

        cy.get(".blog").should(($blog) => {
          let blogs = $blog.map((i, el) => {
            return Cypress.$(el).text();
          });

          blogs = blogs.get();

          expect(blogs).to.have.length(3);
          expect(blogs[0]).contains("likes: 2");
          expect(blogs[1]).contains("likes: 1");
          expect(blogs[2]).contains("likes: 0");
        });
      });
    });
  });
});
