import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../../errors";
import { SignUpController } from "./signup.controller";
import {
  IEmailValidator,
  IAddAccount,
  IAccountModel,
  IAddAccountModel,
} from "./signup.protocols";

interface IMakeSut {
  sut: SignUpController;
  emailValidatorStub: IEmailValidator;
  addAccountStub: IAddAccount;
}

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
    async add(account: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@email.com",
        password: "valid_password",
      };

      return new Promise((resolve) => resolve(fakeAccount));
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

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
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

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
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

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
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

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
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

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
  });

  test("should return 400 if provided email is invalid", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: "John Doe",
        email: "invalidemail@mail.com",
        password: "123456",
        passwordConfirmation: "123456",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("should call email validator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isEmailValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    const httpRequest = {
      body: {
        name: "John Doe",
        email: "invalidemail@mail.com",
        password: "123456",
        passwordConfirmation: "123456",
      },
    };

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

    const httpRequest = {
      body: {
        name: "John Doe",
        email: "invalidemail@mail.com",
        password: "123456",
        passwordConfirmation: "123456",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should call AddAcount with valid data", async () => {
    const { sut, addAccountStub } = makeSut();

    const addAccountSpy = jest.spyOn(addAccountStub, "add");

    const httpRequest = {
      body: {
        name: "John Doe",
        email: "valid_email@email.com",
        password: "123456",
        passwordConfirmation: "123456",
      },
    };

    sut.handle(httpRequest);

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: "John Doe",
      email: "valid_email@email.com",
      password: "123456",
    });
  });

  test("should return 500 if AddAccount throws", async () => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();

    jest.spyOn(addAccountStub, "add").mockImplementation(async () => {
      return new Promise((_, reject) => reject(new Error()));
    });

    const sut = new SignUpController(emailValidatorStub, addAccountStub);

    const httpRequest = {
      body: {
        name: "John Doe",
        email: "valid_email@email.com",
        password: "123456",
        passwordConfirmation: "123456",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "John Doe",
        email: "valid_email@email.com",
        password: "123456",
        passwordConfirmation: "123456",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    });
  });
});
