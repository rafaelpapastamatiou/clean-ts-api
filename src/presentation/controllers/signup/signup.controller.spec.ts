import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../../errors";
import {
  httpBadRequest,
  httpServerError,
  httpSuccess,
} from "../../helpers/http-helpers";
import { SignUpController } from "./signup.controller";
import {
  IEmailValidator,
  IAddAccount,
  IAccountModel,
  IAddAccountModel,
  IHttpRequest,
} from "./signup.protocols";

interface IMakeSut {
  sut: SignUpController;
  emailValidatorStub: IEmailValidator;
  addAccountStub: IAddAccount;
}

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: "John Doe",
    email: "valid_email@email.com",
    password: "123456",
    passwordConfirmation: "123456",
  },
});

const makeFakeAccount = (): IAccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@email.com",
  password: "valid_password",
});

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(_account: IAddAccountModel): Promise<IAccountModel> {
      return makeFakeAccount();
    }
  }

  return new AddAccountStub();
};

const makeSut = (): IMakeSut => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();

  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

describe("SignUp Controller", () => {
  const { sut } = makeSut();

  test("should return 400 if no name is provided", async () => {
    const httpRequest = {
      body: {
        email: "johndoe@email.com",
        password: "123456",
        passwordConfirmation: "123456",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(httpBadRequest(new MissingParamError("name")));
  });

  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "John Doe",
        password: "123456",
        passwordConfirmation: "123456",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      httpBadRequest(new MissingParamError("email"))
    );
  });

  test("should return 400 if no password is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "John Doe",
        email: "johndoe@email.com",
        passwordConfirmation: "123456",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      httpBadRequest(new MissingParamError("password"))
    );
  });

  test("should return 400 if no password confirmation is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "John Doe",
        email: "johndoe@email.com",
        password: "123456",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      httpBadRequest(new MissingParamError("passwordConfirmation"))
    );
  });

  test("should return 400 if password confirmation fails", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "John Doe",
        email: "johndoe@email.com",
        password: "123456",
        passwordConfirmation: "invalid_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      httpBadRequest(new InvalidParamError("passwordConfirmation"))
    );
  });

  test("should return 400 if provided email is invalid", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      httpBadRequest(new InvalidParamError("email"))
    );
  });

  test("should call email validator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isEmailValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    const httpRequest = makeFakeRequest();

    sut.handle(httpRequest);

    expect(isEmailValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  test("should return 500 if EmailValidator throws", async () => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();

    jest.spyOn(emailValidatorStub, "isValid").mockImplementation(() => {
      throw new Error();
    });

    const sut = new SignUpController(emailValidatorStub, addAccountStub);

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(httpServerError(new ServerError()));
  });

  test("should call AddAcount with valid data", async () => {
    const { sut, addAccountStub } = makeSut();

    const addAccountSpy = jest.spyOn(addAccountStub, "add");

    const httpRequest = makeFakeRequest();

    sut.handle(httpRequest);

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  test("should return 500 if AddAccount throws", async () => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();

    jest.spyOn(addAccountStub, "add").mockImplementation(async () => {
      return new Promise((_, reject) => reject(new Error()));
    });

    const sut = new SignUpController(emailValidatorStub, addAccountStub);

    const httpRequest = {};

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(httpServerError(new ServerError()));
  });

  test("should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    const fakeAccount = makeFakeAccount();

    expect(httpResponse).toEqual(httpSuccess(fakeAccount));
  });
});
