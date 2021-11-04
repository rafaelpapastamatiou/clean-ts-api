import { MissingParamError } from "../errors/missing-param.error";
import { httpBadRequest } from "../helpers/http/http-bad-request";
import { IHttpRequest, IHttpResponse } from "../protocols/http";

export class SignUpController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ["name", "email", "password"];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return httpBadRequest(new MissingParamError(field));
      }
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
