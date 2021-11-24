import { IValidation } from "./validation";
import { ValidationComposite } from "./validation.composite";

describe("ValidationComposite", () => {
  test("should return an error if any validation fails", async () => {
    class ValidationStub implements IValidation {
      async validate(
        _data: Record<string, unknown>
      ): Promise<Error | undefined> {
        return new Error();
      }
    }
    const validationStub = new ValidationStub();

    const sut = new ValidationComposite([validationStub]);

    const error = await sut.validate({
      field: "any_value",
    });

    expect(error).toEqual(new Error());
  });
});
