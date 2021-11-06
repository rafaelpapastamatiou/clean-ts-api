import { EmailValidatorAdapter } from "./email-validator.adapter";

describe("EmailValidator Adapter", () => {
  test("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();

    const isEmailValid = sut.isValid("invalid_email@mail.com");

    expect(isEmailValid).toBe(false);
  });
});
