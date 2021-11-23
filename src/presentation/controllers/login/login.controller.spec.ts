import { InvalidParamError, MissingParamError } from "../../errors";
import { httpBadRequest } from "../../helpers/http-helpers";
import { LoginController } from "./login.controller";
import { IEmailValidator, IHttpRequest } from "./login.protocols";

interface IMakeSut {
  sut: LoginController;
  emailValidatorStub: IEmailValidator;
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): IMakeSut => {
  const emailValidatorStub = makeEmailValidator();

  const sut = new LoginController(emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
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

    const httpRequest: IHttpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  test("should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpRequest: IHttpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      httpBadRequest(new InvalidParamError("email"))
    );
  });
});
