import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param.error";
import { httpBadRequest } from "../helpers/http-helpers";
import { IController } from "../protocols/controller";
import { IEmailValidator } from "../protocols/email-validator";
import { IHttpRequest, IHttpResponse } from "../protocols/http";

export class SignUpController implements IController {
  constructor(private emailValidator: IEmailValidator) {}

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

    const emailIsValid = this.emailValidator.isValid(httpRequest.body.email);

    if (!emailIsValid) {
      return httpBadRequest(new InvalidParamError("email"));
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
