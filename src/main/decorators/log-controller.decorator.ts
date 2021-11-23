import { IErrorLogRepository } from "../../data/protocols/error-log.repository";
import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from "../../presentation/protocols";

export class LogControllerDecorator implements IController {
  constructor(
    private controller: IController,
    private errorLogRepository: IErrorLogRepository
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500)
      await this.errorLogRepository.logError(httpResponse.body.stack);

    return httpResponse;
  }
}
