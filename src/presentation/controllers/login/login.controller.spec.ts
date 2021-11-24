import { MissingParamError } from "../../errors";
import {
  httpBadRequest,
  httpServerError,
  httpSuccess,
  httpUnauthorized,
} from "../../helpers/http/http-helpers";
import { LoginController } from "./login.controller";
import {
  IHttpRequest,
  IAuthentication,
  IAuthenticationModel,
  IValidation,
} from "./login.protocols";

interface IMakeSut {
  sut: LoginController;
  authenticationStub: IAuthentication;
  validationStub: IValidation;
}

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    email: "any_email@email.com",
    password: "any_password",
  },
});

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(_data: IAuthenticationModel): Promise<string> {
      return "any_token";
    }
  }

  return new AuthenticationStub();
};

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    async validate(_data: Record<string, unknown>): Promise<Error | undefined> {
      return undefined;
    }
  }

  return new ValidationStub();
};

const makeSut = (): IMakeSut => {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();

  const sut = new LoginController(authenticationStub, validationStub);

  return {
    sut,
    authenticationStub,
    validationStub,
  };
};

describe("Login Controller", () => {
  test("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, "auth");

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(authSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  test("should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(undefined)));

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(httpUnauthorized());
  });

  test("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();

    const fakeError = new Error();

    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(async () => {
      throw fakeError;
    });

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(httpServerError(fakeError));
  });

  test("should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      httpSuccess({
        accessToken: "any_token",
      })
    );
  });

  test("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, "validate");

    const httpRequest = makeFakeRequest();

    sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();

    const fakeError = new MissingParamError("any_field");

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new Promise((resolve) => resolve(fakeError)));

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(httpBadRequest(fakeError));
  });
});
