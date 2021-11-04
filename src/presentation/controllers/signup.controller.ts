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

      const { email, password, passwordConfirmation } = httpRequest.body;

      const emailIsValid = this.emailValidator.isValid(email);

      if (!emailIsValid) {
        return httpBadRequest(new InvalidParamError("email"));
      }

      if (password !== passwordConfirmation) {
        return httpBadRequest(new InvalidParamError("passwordConfirmation"));
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
