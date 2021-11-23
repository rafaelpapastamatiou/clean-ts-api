import { IAuthentication } from "../../../domain/useCases/authentication";
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
  constructor(
    private emailValidator: IEmailValidator,
    private authentication: IAuthentication
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ["email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return httpBadRequest(new MissingParamError(field));
        }
      }

      const { email, password } = httpRequest.body;

      if (!email) return httpBadRequest(new MissingParamError("email"));

      if (!password) return httpBadRequest(new MissingParamError("password"));

      const isEmailValid = this.emailValidator.isValid(email);

      if (!isEmailValid) return httpBadRequest(new InvalidParamError("email"));

      await this.authentication.auth({
        email,
        password,
      });

      return httpSuccess({});
    } catch (err) {
      return httpServerError(err as Error);
    }
  }
}
