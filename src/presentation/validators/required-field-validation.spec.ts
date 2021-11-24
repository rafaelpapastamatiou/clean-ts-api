import { MissingParamError } from "../errors";
import { RequiredFieldValidation } from "./required-field-validation";

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation("field");
};

describe("RequiredField Validation", () => {
  test("should return a MissingParamError if validation fails", async () => {
    const sut = makeSut();

    const error = await sut.validate({
      name: "any_name",
    });

    expect(error).toEqual(new MissingParamError("field"));
  });

  test("should return a falsy value if validation succeeds", async () => {
    const sut = makeSut();

    const error = await sut.validate({
      field: "any_field",
    });

    expect(error).toBeFalsy();
  });
});
