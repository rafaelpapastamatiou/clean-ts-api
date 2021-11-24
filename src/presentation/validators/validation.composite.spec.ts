import { IValidation } from "./validation";
import { ValidationComposite } from "./validation.composite";

interface IMakeSut {
  sut: ValidationComposite;
  validationStubs: IValidation[];
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
  const validationStubs = [makeValidation(), makeValidation()];

  const sut = new ValidationComposite(validationStubs);

  return {
    sut,
    validationStubs,
  };
};

describe("ValidationComposite", () => {
  test("should return an error if any validation fails", async () => {
    const { validationStubs, sut } = makeSut();

    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new Promise((resolve) => resolve(new Error())));

    const error = await sut.validate({
      field: "any_value",
    });

    expect(error).toEqual(new Error());
  });

  test("should return the first error if more then one validation fails", async () => {
    const { validationStubs, sut } = makeSut();

    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(new Error("first_error")))
      );

    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(new Error("second_error")))
      );

    const error = await sut.validate({
      field: "any_value",
    });

    expect(error).toEqual(new Error("first_error"));
  });

  test("should return a falsy value if validation succeeds", async () => {
    const { sut } = makeSut();

    const error = await sut.validate({
      field: "any_value",
    });

    expect(error).toBeFalsy();
  });
});
