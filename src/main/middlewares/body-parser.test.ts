import request from "supertest";

import { app } from "../app";

describe("Body Parser Middleware", () => {
  test("should parse request body as json", async () => {
    app.post("/test_body_parser", (req, res) => {
      return res.send(req.body);
    });

    const data = {
      name: "John Doe",
    };

    await request(app).post("/test_body_parser").send(data).expect(data);
  });
});
