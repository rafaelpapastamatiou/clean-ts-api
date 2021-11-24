import { IEmailValidator } from "../../../presentation/protocols/email-validator";
import { EmailValidation } from "../../../presentation/validators/email-validation";
import { RequiredFieldValidation } from "../../../presentation/validators/required-field-validation";
import { ValidationComposite } from "../../../presentation/validators/validation.composite";
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
