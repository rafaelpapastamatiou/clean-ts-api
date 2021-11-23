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
} from "./login.protocols";

export class LoginController implements IController {
  constructor(private emailValidator: IEmailValidator) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      if (!email) return httpBadRequest(new MissingParamError("email"));

      if (!password) return httpBadRequest(new MissingParamError("password"));

      const isEmailValid = this.emailValidator.isValid(email);

      if (!isEmailValid) return httpBadRequest(new InvalidParamError("email"));

      return httpSuccess({});
    } catch (err) {
      return httpServerError(err as Error);
    }
  }
}
