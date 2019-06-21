const request = require("supertest");

const app = require("../../src/app");
const { generateUser } = require("../factories");

describe("Authentication", () => {
  it("should sign up a new user", async () => {
    const user = generateUser();
    await request(app)
      .post("/api/users/signup")
      .send(user)
      .expect(200);
  });

  it("should give a JWT token to a signed up user", async () => {
    const user = generateUser();
    const response = await request(app)
      .post("/api/users/signup")
      .send(user)
      .expect(200);
    expect(response.body).toHaveProperty("token");
  });
});
