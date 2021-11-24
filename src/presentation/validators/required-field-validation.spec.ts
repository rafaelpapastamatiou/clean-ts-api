import { MissingParamError } from "../errors";
import { RequiredFieldValidation } from "./required-field-validation";

describe("RequiredField Validation", () => {
  test("should return a MissingParamError if validation fails", async () => {
    const sut = new RequiredFieldValidation("field");

    const error = await sut.validate({
      name: "any_name",
    });

    expect(error).toEqual(new MissingParamError("field"));
  });
});
