import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log-controller.decorator";

describe("LogController Decorator", () => {
  test("should call controller handle", async () => {
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

    const handleSpy = jest.spyOn(controllerStub, "handle");

    const sut = new LogControllerDecorator(controllerStub);

    const httpRequest: IHttpRequest = {
      body: {
        name: "John Doe",
        email: "johndoe@gmail.com",
      },
    };

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
