import { MissingParamError, ServerError } from "../../errors";
import {
  httpBadRequest,
  httpServerError,
  httpSuccess,
} from "../../helpers/http-helpers";
import { SignUpController } from "./signup.controller";
import {
  IAddAccount,
  IAccountModel,
  IAddAccountModel,
  IHttpRequest,
  IValidation,
} from "./signup.protocols";

interface IMakeSut {
  sut: SignUpController;
  addAccountStub: IAddAccount;
  validationStub: IValidation;
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

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(_account: IAddAccountModel): Promise<IAccountModel> {
      return makeFakeAccount();
    }
  }

  return new AddAccountStub();
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
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();

  const sut = new SignUpController(addAccountStub, validationStub);

  return {
    sut,
    addAccountStub,
    validationStub,
  };
};

describe("SignUp Controller", () => {
  test("should call AddAcount with valid data", async () => {
    const { sut, addAccountStub } = makeSut();

    const addAccountSpy = jest.spyOn(addAccountStub, "add");

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  test("should return 500 if AddAccount throws", async () => {
    const addAccountStub = makeAddAccount();
    const validationStub = makeValidation();
    jest.spyOn(addAccountStub, "add").mockImplementation(async () => {
      return new Promise((_, reject) => reject(new Error()));
    });

    const sut = new SignUpController(addAccountStub, validationStub);

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
