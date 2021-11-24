import { IEmailValidator } from "../../../presentation/protocols/email-validator";
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../presentation/validators";
import { makeLoginValidation } from "./login-validation.factory";

jest.mock("../../../presentation/validators/validation.composite");

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe("Login Validation Factory", () => {
  test("should call ValidationComposite with correct validations", () => {
    makeLoginValidation();

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation("email"),
      new RequiredFieldValidation("password"),
      new EmailValidation("email", makeEmailValidator()),
    ]);
  });
});
