import { IValidation } from "../../../presentation/protocols/validation";
import { EmailValidation } from "../../../presentation/validators/email-validation";
import { RequiredFieldValidation } from "../../../presentation/validators/required-field-validation";
import { ValidationComposite } from "../../../presentation/validators/validation.composite";
import { EmailValidatorAdapter } from "../../../utils/email-validator.adapter";

export const makeLoginValidation = (): IValidation => {
  return new ValidationComposite([
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new EmailValidation("email", new EmailValidatorAdapter()),
  ]);
};
