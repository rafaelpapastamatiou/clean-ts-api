import { IEmailValidator } from "../../../presentation/protocols/email-validator";
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../presentation/validators";
import { makeSignUpValidation } from "./signup-validation.factory";

jest.mock("../../../presentation/validators/validation.composite");

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe("SignUp Validation Factory", () => {
  test("should call ValidationComposite with correct validations", () => {
    makeSignUpValidation();

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation("name"),
      new RequiredFieldValidation("email"),
      new RequiredFieldValidation("password"),
      new RequiredFieldValidation("passwordConfirmation"),
      new CompareFieldsValidation("password", "passwordConfirmation"),
      new EmailValidation("email", makeEmailValidator()),
    ]);
  });
});
