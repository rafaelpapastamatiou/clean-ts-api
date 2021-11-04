import { MissingParamError } from "../errors/missing-param.error";
import { SignUpController } from "./signup.controller";

const makeSut = (): SignUpController => {
  return new SignUpController();
};

describe("SignUp Controller", () => {
  const sut = makeSut();

  test("should return 400 if no name is provided", () => {
    const httpRequest = {
      body: {
        email: "johndoe@email.com",
        password: "123456",
        passwordConfirmation: "123456",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  test("should return 400 if no email is provided", () => {
    const sut = makeSut();

    const httpRequest = {
      body: {
        name: "John Doe",
        password: "123456",
        passwordConfirmation: "123456",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("should return 400 if no password is provided", () => {
    const sut = makeSut();

    const httpRequest = {
      body: {
        name: "John Doe",
        email: "johndoe@email.com",
        passwordConfirmation: "123456",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("should return 400 if no password confirmation is provided", () => {
    const sut = makeSut();

    const httpRequest = {
      body: {
        name: "John Doe",
        email: "johndoe@email.com",
        password: "123456",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });
});
