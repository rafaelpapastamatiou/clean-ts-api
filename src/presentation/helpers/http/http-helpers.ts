import { ServerError } from "../../errors";
import { UnauthorizedError } from "../../errors/unauthorized.error";
import { IHttpResponse } from "../../protocols";

export function httpBadRequest(err: Error): IHttpResponse {
  return {
    statusCode: 400,
    body: err,
  };
}

export function httpServerError(err: Error): IHttpResponse {
  return {
    statusCode: 500,
    body: new ServerError(err.stack),
  };
}

export function httpSuccess(data: any): IHttpResponse {
  return {
    statusCode: 200,
    body: data,
  };
}

export function httpUnauthorized(): IHttpResponse {
  return {
    statusCode: 400,
    body: new UnauthorizedError(),
  };
}
