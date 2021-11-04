import { IHttpResponse } from "../../protocols/http";

export function httpBadRequest(err: Error): IHttpResponse {
  return {
    statusCode: 400,
    body: err,
  };
}
