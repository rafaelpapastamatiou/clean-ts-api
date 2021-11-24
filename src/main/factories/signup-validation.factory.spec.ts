import { CompareFieldsValidation } from "../../presentation/validators/compare-fields-validation";
import { RequiredFieldValidation } from "../../presentation/validators/required-field-validation";
import { ValidationComposite } from "../../presentation/validators/validation.composite";
import { makeSignUpValidation } from "./signup-validation.factory";

jest.mock("../../presentation/validators/validation.composite");

describe("SignUp Validation Factory", () => {
  test("should call ValidationComposite with correct validations", () => {
    makeSignUpValidation();

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation("name"),
      new RequiredFieldValidation("email"),
      new RequiredFieldValidation("password"),
      new RequiredFieldValidation("passwordConfirmation"),
      new CompareFieldsValidation("password", "passwordConfirmation"),
    ]);
  });
});
