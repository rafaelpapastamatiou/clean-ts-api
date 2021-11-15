import bcrypt from "bcrypt";

import { BcryptAdapter } from "./bcrypt.adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return "hashed_value";
  },
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe("Bcrypt Adapter", () => {
  test("should call bcrypt with correct values", () => {
    const sut = makeSut();

    const hashSpy = jest.spyOn(bcrypt, "hash");

    sut.encrypt("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("should return value hash on success", async () => {
    const sut = makeSut();

    const hash = await sut.encrypt("any_value");

    expect(hash).toBe("hashed_value");
  });
});
