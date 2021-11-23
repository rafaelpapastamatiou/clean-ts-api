import { IErrorLogRepository } from "../../data/protocols/error-log.repository";
import { httpServerError } from "../../presentation/helpers/http-helpers";
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

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle(_httpRequest: IHttpRequest): Promise<IHttpResponse> {
      return {
        statusCode: 200,
        body: {
          ok: true,
        },
      };
    }
  }

  return new ControllerStub();
};

const makeErrorLogRepository = (): IErrorLogRepository => {
  class ErrorLogRepositoruStub implements IErrorLogRepository {
    async log(stack: string): Promise<void> {
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

    const httpRequest: IHttpRequest = {
      body: {
        name: "John Doe",
        email: "johndoe@gmail.com",
      },
    };

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test("should return the same value of the controller", async () => {
    const { sut } = makeSut();

    const httpRequest: IHttpRequest = {
      body: {
        name: "John Doe",
        email: "johndoe@gmail.com",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        ok: true,
      },
    });
  });

  test("should call ErrorLogRepository with error if controller returns a HttpServerError", async () => {
    const { sut, controllerStub, errorLogRepositoryStub } = makeSut();

    const fakeError = new Error();
    fakeError.stack = "any error stack";

    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(httpServerError(fakeError)))
      );

    const logSpy = jest.spyOn(errorLogRepositoryStub, "log");

    const httpRequest: IHttpRequest = {
      body: {
        name: "John Doe",
        email: "johndoe@gmail.com",
      },
    };

    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith(fakeError.stack);
  });
});
