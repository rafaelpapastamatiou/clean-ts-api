import request from "supertest";

import { MongoHelper } from "../../infra/database/mongodb/helpers/mongo-helper";
import { app } from "../app";

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountsCollection = MongoHelper.getCollection("accounts");
    await accountsCollection.deleteMany({});
  });

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
