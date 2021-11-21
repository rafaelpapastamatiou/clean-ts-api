import request from "supertest";

import { app } from "../app";

describe("Content Type Middleware", () => {
  test("should return response content-type as json by default", async () => {
    app.get("/test_content_type", (_, res) => {
      return res.send("");
    });

    await request(app).get("/test_content_type").expect("content-type", /json/);
  });

  test("should return xml content type when specified", async () => {
    app.get("/test_content_type_xml", (_, res) => {
      res.type("xml");
      return res.send("");
    });

    await request(app)
      .get("/test_content_type_xml")
      .expect("content-type", /xml/);
  });
});
