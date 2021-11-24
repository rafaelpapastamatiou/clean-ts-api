import { CompareFieldsValidation } from "../../presentation/validators/compare-fields-validation";
import { RequiredFieldValidation } from "../../presentation/validators/required-field-validation";
import { IValidation } from "../../presentation/validators/validation";
import { ValidationComposite } from "../../presentation/validators/validation.composite";

export const makeSignUpValidation = (): IValidation => {
  return new ValidationComposite([
    new RequiredFieldValidation("name"),
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new RequiredFieldValidation("passwordConfirmation"),
    new CompareFieldsValidation("password", "passwordConfirmation"),
  ]);
};
