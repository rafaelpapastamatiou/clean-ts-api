import { IEncrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface IMakeSut {
  sut: DbAddAccount;
  encrypterStub: IEncrypter;
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return value;
    }
  }

  return new EncrypterStub();
};

const makeSut = (): IMakeSut => {
  const encrypterStub = makeEncrypter();

  const sut = new DbAddAccount(encrypterStub);

  return { sut, encrypterStub };
};

describe("DbAddAccount UseCase", () => {
  test("should  call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

    const accountData = {
      name: "John Doe",
      email: "johndoe@email.com",
      password: "johndoepwd123",
    };

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith("johndoepwd123");
  });

  test("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(
      new Promise((_, reject) => {
        reject(new Error());
      })
    );

    const accountData = {
      name: "John Doe",
      email: "johndoe@email.com",
      password: "johndoepwd123",
    };

    const account = sut.add(accountData);

    await expect(account).rejects.toThrow();
  });
});
