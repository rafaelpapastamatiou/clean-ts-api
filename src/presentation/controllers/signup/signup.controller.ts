import {
  httpBadRequest,
  httpServerError,
  httpSuccess,
} from "../../helpers/http-helpers";
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IAddAccount,
  IValidation,
} from "./signup.protocols";

export class SignUpController implements IController {
  constructor(
    private addAccount: IAddAccount,
    private validation: IValidation
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);

      if (error) {
        return httpBadRequest(error);
      }

      const { email, password, name } = httpRequest.body;

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
