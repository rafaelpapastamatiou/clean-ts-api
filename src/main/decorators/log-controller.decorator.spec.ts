import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log-controller.decorator";

interface IMakeSut {
  sut: LogControllerDecorator;
  controllerStub: IController;
}

const makeSut = (): IMakeSut => {
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

  const controllerStub = new ControllerStub();

  const sut = new LogControllerDecorator(controllerStub);

  return {
    sut,
    controllerStub,
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
});
