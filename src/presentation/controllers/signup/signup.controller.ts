import { InvalidParamError, MissingParamError } from "../../errors";
import {
  httpBadRequest,
  httpServerError,
  httpSuccess,
} from "../../helpers/http-helpers";
import {
  IController,
  IEmailValidator,
  IHttpRequest,
  IHttpResponse,
  IAddAccount,
} from "./signup.protocols";

export class SignUpController implements IController {
  constructor(
    private emailValidator: IEmailValidator,
    private addAccount: IAddAccount
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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

      const { email, password, passwordConfirmation, name } = httpRequest.body;

      const emailIsValid = this.emailValidator.isValid(email);

      if (!emailIsValid) {
        return httpBadRequest(new InvalidParamError("email"));
      }

      if (password !== passwordConfirmation) {
        return httpBadRequest(new InvalidParamError("passwordConfirmation"));
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      return httpSuccess(account);
    } catch (err) {
      return httpServerError(err as Error);
    }
  }
}
