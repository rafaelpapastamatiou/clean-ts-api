import {
  httpBadRequest,
  httpServerError,
  httpSuccess,
  httpUnauthorized,
} from "../../helpers/http-helpers";
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IAuthentication,
  IValidation,
} from "./login.protocols";

export class LoginController implements IController {
  constructor(
    private authentication: IAuthentication,
    private validation: IValidation
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);

      if (error) {
        return httpBadRequest(error);
      }

      const { email, password } = httpRequest.body;

      const accessToken = await this.authentication.auth({
        email,
        password,
      });

      if (!accessToken) return httpUnauthorized();

      return httpSuccess({
        accessToken,
      });
    } catch (err) {
      return httpServerError(err as Error);
    }
  }
}
