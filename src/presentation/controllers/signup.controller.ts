import { MissingParamError } from "../errors/missing-param.error";
import { httpBadRequest } from "../helpers/http/http-bad-request";
import { IHttpRequest, IHttpResponse } from "../protocols/http";

export class SignUpController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return httpBadRequest(new MissingParamError("name"));
    }

    if (!httpRequest.body.email) {
      return httpBadRequest(new MissingParamError("email"));
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
