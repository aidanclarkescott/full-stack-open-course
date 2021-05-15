const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

let token;

beforeEach(async () => {
  // Init old style blogs
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  // Init user
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash });

  await user.save();

  // Login user and generate token
  const loginResponse = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });
  token = loginResponse.body.token;
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blog posts have id property", async () => {
  const blogs = await helper.blogsInDb();

  blogs.forEach((blog) => expect(blog.id).toBeDefined());
});

test("a valid note can be added", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Tester",
    url: "https://google.com/",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .set({ Authorization: `bearer ${token}` })
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).toContain("Test Blog");
});

test("if blog is made without likes, it defaults to 0", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Tester",
    url: "https://google.com/",
  };

  const blog = await api
    .post("/api/blogs")
    .send(newBlog)
    .set({ Authorization: `bearer ${token}` })
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(blog.body.likes).toBeDefined();
});

test("blog creation without title and url return bad request", async () => {
  const newBlog = {
    author: "Tester",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .set({ Authorization: `bearer ${token}` })
    .expect(400);
});

test("deletion of valid note returns 204", async () => {
  const blog = {
    title: "Test Blog",
    author: "test",
    url: "www.link.com/",
    likes: 5,
  };

  const newBlog = await api
    .post("/api/blogs")
    .send(blog)
    .set({ Authorization: `bearer ${token}` })
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtStart = await helper.blogsInDb();

  let titles = blogsAtStart.map((r) => r.title);
  expect(titles).toContain(newBlog.body.title);

  await api
    .delete(`/api/blogs/${newBlog.body.id}`)
    .set({ Authorization: `bearer ${token}` })
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

  titles = blogsAtEnd.map((r) => r.title);

  expect(titles).not.toContain(newBlog.body.title);
});

test("adding new not without token returns 401", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Tester",
    url: "https://google.com/",
    likes: 10,
  };

  await api.post("/api/blogs").send(newBlog).expect(401);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).not.toContain("Test Blog");
});

test("updating likes of existing valid note", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const newBlog = {
    ...blogToUpdate,
    likes: 100,
  };

  const updatedBlog = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200);

  expect(updatedBlog.body.likes).toBeDefined();
  expect(updatedBlog.body.likes).toBe(100);
});

describe("when there is initially one user in db", () => {
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with an invalid username", async () => {
    const usersAtStart = await helper.usersInDb();
    const user = usersAtStart[0];

    const newUser = {
      username: user.username,
      name: user.name,
      password: "newuniquepassword",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with an invalid password", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "newunusedusername",
      name: "test name",
      password: "no",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
