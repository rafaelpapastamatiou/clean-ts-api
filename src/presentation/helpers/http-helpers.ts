import { ServerError } from "../errors/server.error.ts";
import { IHttpResponse } from "../protocols/http";

export function httpBadRequest(err: Error): IHttpResponse {
  return {
    statusCode: 400,
    body: err,
  };
}

export function httpServerError(): IHttpResponse {
  return {
    statusCode: 500,
    body: new ServerError(),
  };
}
