import { IValidation } from "../../../presentation/protocols/validation";
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../presentation/validators";
import { EmailValidatorAdapter } from "../../../utils/email-validator.adapter";

export const makeSignUpValidation = (): IValidation => {
  return new ValidationComposite([
    new RequiredFieldValidation("name"),
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new RequiredFieldValidation("passwordConfirmation"),
    new CompareFieldsValidation("password", "passwordConfirmation"),
    new EmailValidation("email", new EmailValidatorAdapter()),
  ]);
};
