const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");           // Correct path from tests/ → src/app.js
const User = require("../src/models/User");  // Correct path from tests/ → src/models/User.js

beforeAll(async () => {
  process.env.NODE_ENV = "test";

  // Connect to test database only if not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  }
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API", () => {
  const testEmail = `test${Date.now()}@example.com`;

  // ✅ Register a new user
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        email: testEmail,
        password: "123456",
      });

    expect(res.statusCode).toBe(201);
  });

  // ✅ Fail on missing fields
  it("should fail if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        email: "missing@example.com",
      });

    expect(res.statusCode).toBe(400);
  });

  // ✅ Login success
  it("should login an existing user", async () => {
    await request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        email: testEmail,
        password: "123456",
      });

    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: testEmail,
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
  });

  // ✅ Fail login with wrong password
  it("should fail login with wrong password", async () => {
    await request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        email: testEmail,
        password: "123456",
      });

    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: testEmail,
        password: "wrongpass",
      });

    expect(res.statusCode).toBe(401);
  });

  // ✅ Fail duplicate email
  it("should fail if email already exists", async () => {
    const duplicateEmail = `duplicate${Date.now()}@example.com`;

    await request(app)
      .post("/api/users/register")
      .send({
        name: "Test",
        email: duplicateEmail,
        password: "123456",
      });

    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "Duplicate",
        email: duplicateEmail,
        password: "123456",
      });

    expect(res.statusCode).toBe(400);   // Change to 409 if your controller returns 409
  });
});