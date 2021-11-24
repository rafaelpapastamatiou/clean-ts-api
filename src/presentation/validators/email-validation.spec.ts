import { InvalidParamError } from "../errors";
import { IEmailValidator } from "../protocols/email-validator";
import { EmailValidation } from "./email-validation";

interface IMakeSut {
  sut: EmailValidation;
  emailValidatorStub: IEmailValidator;
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): IMakeSut => {
  const emailValidatorStub = makeEmailValidator();

  const sut = new EmailValidation("email", emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  };
};

describe("Email Validation", () => {
  test("should call email validator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();

    const isEmailValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    sut.validate({
      email: "any_email@email.com",
    });

    expect(isEmailValidSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("should throw if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.validate({ email: "any_email@email.com" });

    expect(promise).rejects.toThrow();
  });

  test("should return an error if EmailValidator returns false", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const error = await sut.validate({ email: "any_email@email.com" });

    expect(error).toEqual(new InvalidParamError("email"));
  });
});
