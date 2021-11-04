import { MissingParamError } from "../errors/missing-param.error";
import { httpBadRequest } from "../helpers/http-helpers";
import { IController } from "../protocols/controller";
import { IHttpRequest, IHttpResponse } from "../protocols/http";

export class SignUpController implements IController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = [
      "name",
      "email",
      "password",
      "passwordConfirmation",
    ];

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
