import { IValidation } from "./validation";
import { ValidationComposite } from "./validation.composite";

interface IMakeSut {
  sut: ValidationComposite;
  validationStub: IValidation;
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    async validate(_data: Record<string, unknown>): Promise<Error | undefined> {
      return undefined;
    }
  }

  return new ValidationStub();
};

const makeSut = (): IMakeSut => {
  const validationStub = makeValidation();

  const sut = new ValidationComposite([validationStub]);

  return {
    sut,
    validationStub,
  };
};

describe("ValidationComposite", () => {
  test("should return an error if any validation fails", async () => {
    const { validationStub, sut } = makeSut();

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new Promise((resolve) => resolve(new Error())));

    const error = await sut.validate({
      field: "any_value",
    });

    expect(error).toEqual(new Error());
  });
});
