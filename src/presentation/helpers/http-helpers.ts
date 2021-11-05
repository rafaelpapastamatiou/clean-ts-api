import { ServerError } from "../errors";
import { IHttpResponse } from "../protocols";

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

export function httpSuccess(data: any): IHttpResponse {
  return {
    statusCode: 200,
    body: data,
  };
}
