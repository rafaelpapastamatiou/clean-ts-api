import { InvalidParamError, MissingParamError } from "../errors";
import { httpBadRequest, httpServerError } from "../helpers/http-helpers";
import {
  IController,
  IEmailValidator,
  IHttpRequest,
  IHttpResponse,
} from "../protocols";

export class SignUpController implements IController {
  constructor(private emailValidator: IEmailValidator) {}

  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
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
    } catch (err) {
      return httpServerError();
    }
  }
}
