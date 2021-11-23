import { InvalidParamError, MissingParamError } from "../../errors";
import {
  httpBadRequest,
  httpServerError,
  httpSuccess,
  httpUnauthorized,
} from "../../helpers/http-helpers";
import { LoginController } from "./login.controller";
import {
  IEmailValidator,
  IHttpRequest,
  IAuthentication,
  IAuthenticationModel,
} from "./login.protocols";

interface IMakeSut {
  sut: LoginController;
  emailValidatorStub: IEmailValidator;
  authenticationStub: IAuthentication;
}

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    email: "any_email@email.com",
    password: "any_password",
  },
});

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(_data: IAuthenticationModel): Promise<string> {
      return "any_token";
    }
  }

  return new AuthenticationStub();
};

const makeSut = (): IMakeSut => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();

  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
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

  test("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  test("should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      httpBadRequest(new InvalidParamError("email"))
    );
  });

  test("should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();

    const fakeError = new Error();

    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw fakeError;
    });

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(httpServerError(fakeError));
  });

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
});
