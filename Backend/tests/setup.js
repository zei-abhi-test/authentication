const request = require("supertest")
const mongoose = require("mongoose")
const app = require("../src/app")
const User = require("../src/models/User")

let testEmail

beforeAll(async () => {
  process.env.NODE_ENV = "test"
  await mongoose.connect(process.env.MONGO_URI_TEST)
})

beforeEach(() => {
  testEmail = `test${Date.now()}@example.com`
})

afterEach(async () => {
  await User.deleteMany({})
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe("Auth API", () => {

  it("registers a user", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: testEmail,
      password: "123456"
    })

    expect(res.statusCode).toBe(201)
  })

  it("fails if fields are missing", async () => {
    const res = await request(app).post("/api/users/register").send({
      email: testEmail
    })

    expect(res.statusCode).toBe(400)
  })

  it("logs in user", async () => {
    await request(app).post("/api/users/register").send({
      name: "Test User",
      email: testEmail,
      password: "123456"
    })

    const res = await request(app).post("/api/users/login").send({
      email: testEmail,
      password: "123456"
    })

    expect(res.statusCode).toBe(200)
  })

  it("fails login with wrong password", async () => {
    await request(app).post("/api/users/register").send({
      name: "Test User",
      email: testEmail,
      password: "123456"
    })

    const res = await request(app).post("/api/users/login").send({
      email: testEmail,
      password: "wrongpass"
    })

    expect(res.statusCode).toBe(401)
  })

  it("fails duplicate email", async () => {
    await request(app).post("/api/users/register").send({
      name: "Test",
      email: testEmail,
      password: "123456"
    })

    const res = await request(app).post("/api/users/register").send({
      name: "Duplicate",
      email: testEmail,
      password: "123456"
    })

    expect(res.statusCode).toBe(400)
  })

})