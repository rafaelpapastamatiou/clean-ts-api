import { IValidation } from "../../../presentation/protocols/validation";
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../presentation/validators";
import { EmailValidatorAdapter } from "../../../utils/email-validator.adapter";

export const makeLoginValidation = (): IValidation => {
  return new ValidationComposite([
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new EmailValidation("email", new EmailValidatorAdapter()),
  ]);
};
