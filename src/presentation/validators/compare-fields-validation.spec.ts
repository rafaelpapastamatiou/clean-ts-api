import { InvalidParamError } from "../errors";
import { CompareFieldsValidation } from "./compare-fields-validation";

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation("field", "fieldToCompare");
};

describe("CompareFields Validation", () => {
  test("should return a InvalidParamError if validation fails", async () => {
    const sut = makeSut();

    const error = await sut.validate({
      field: "any_value",
      fieldToCompare: "wrong_value",
    });

    expect(error).toEqual(new InvalidParamError("fieldToCompare"));
  });

  test("should return a falsy value if validation succeeds", async () => {
    const sut = makeSut();

    const error = await sut.validate({
      field: "any_value",
      fieldToCompare: "any_value",
    });

    expect(error).toBeFalsy();
  });
});
