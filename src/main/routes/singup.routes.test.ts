import request from "supertest";

import { app } from "../app";

describe("SignUp Routes", () => {
  test("should create a new account", async () => {
    await request(app)
      .post("/signup")
      .send({
        name: "John Doe",
        email: "johndoe@gmail.com",
        password: "123456",
        passwordConfirmation: "123456",
      })
      .expect(200);
  });
});
