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
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      return httpBadRequest(new MissingParamError("email"));
    } catch (err) {
      return httpServerError(err as Error);
    }
  }
}
