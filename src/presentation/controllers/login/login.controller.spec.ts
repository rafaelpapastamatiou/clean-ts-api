import { MissingParamError } from "../../errors";
import { httpBadRequest } from "../../helpers/http-helpers";
import { LoginController } from "./login.controller";
import { IHttpRequest } from "./login.protocols";

interface IMakeSut {
  sut: LoginController;
}

const makeSut = (): IMakeSut => {
  const sut = new LoginController();

  return {
    sut,
  };
};

describe("Login Controller", () => {
  test("should return 400  if no email is provided", async () => {
    const { sut } = makeSut();

    const httpRequest: IHttpRequest = {
      body: {
        password: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      httpBadRequest(new MissingParamError("email"))
    );
  });

  test("should return 400  if no password is provided", async () => {
    const { sut } = makeSut();

    const httpRequest: IHttpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      httpBadRequest(new MissingParamError("password"))
    );
  });
});
