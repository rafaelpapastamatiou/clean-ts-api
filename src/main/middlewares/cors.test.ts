import request from "supertest";

import { app } from "../app";

describe("CORS Middleware", () => {
  test("should enable cors", async () => {
    app.get("/test_cors", (_, res) => {
      return res.send();
    });

    await request(app)
      .get("/test_cors")
      .expect("access-control-allow-origin", "*");
  });
});
