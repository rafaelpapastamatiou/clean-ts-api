import { InvalidParamError } from "../../errors";
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
  IValidation,
} from "./signup.protocols";

export class SignUpController implements IController {
  constructor(
    private emailValidator: IEmailValidator,
    private addAccount: IAddAccount,
    private validation: IValidation
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);

      if (error) {
        return httpBadRequest(error);
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
