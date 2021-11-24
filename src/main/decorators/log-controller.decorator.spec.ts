import { IErrorLogRepository } from "../../data/protocols/error-log.repository";
import {
  httpServerError,
  httpSuccess,
} from "../../presentation/helpers/http/http-helpers";
import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log-controller.decorator";

interface IMakeSut {
  sut: LogControllerDecorator;
  controllerStub: IController;
  errorLogRepositoryStub: IErrorLogRepository;
}

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: "John Doe",
    email: "johndoe@gmail.com",
  },
});

const makeFakeResponse = () => ({
  ok: true,
});

const makeFakeServerError = (): IHttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any error stack";

  return httpServerError(fakeError);
};

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle(_httpRequest: IHttpRequest): Promise<IHttpResponse> {
      return httpSuccess(makeFakeResponse());
    }
  }

  return new ControllerStub();
};

const makeErrorLogRepository = (): IErrorLogRepository => {
  class ErrorLogRepositoruStub implements IErrorLogRepository {
    async logError(_stack: string): Promise<void> {
      // TODO
    }
  }

  return new ErrorLogRepositoruStub();
};

const makeSut = (): IMakeSut => {
  const controllerStub = makeController();
  const errorLogRepositoryStub = makeErrorLogRepository();

  const sut = new LogControllerDecorator(
    controllerStub,
    errorLogRepositoryStub
  );

  return {
    sut,
    controllerStub,
    errorLogRepositoryStub,
  };
};

describe("LogController Decorator", () => {
  test("should call controller handle", async () => {
    const { sut, controllerStub } = makeSut();

    const handleSpy = jest.spyOn(controllerStub, "handle");

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test("should return the same value of the controller", async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    const fakeResponse = makeFakeResponse();

    expect(httpResponse).toEqual(httpSuccess(fakeResponse));
  });

  test("should call ErrorLogRepository with error if controller returns a HttpServerError", async () => {
    const { sut, controllerStub, errorLogRepositoryStub } = makeSut();

    const fakeServerError = makeFakeServerError();

    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(new Promise((resolve) => resolve(fakeServerError)));

    const logSpy = jest.spyOn(errorLogRepositoryStub, "logError");

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith(fakeServerError.body.stack);
  });
});
