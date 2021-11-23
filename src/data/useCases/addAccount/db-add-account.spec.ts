import { DbAddAccount } from "./db-add-account";
import {
  IAccountModel,
  IAddAccountModel,
  IAddAccountRepository,
  IEncrypter,
} from "./db-add-account.protocols";

interface IMakeSut {
  sut: DbAddAccount;
  encrypterStub: IEncrypter;
  addAccountRepositoryStub: IAddAccountRepository;
}

const makeFakeAccount = (): IAccountModel => ({
  id: "valid_id",
  name: "John Doe",
  email: "johndoe@email.com",
  password: "hashed_password",
});

const makeFakeAccountData = (): IAddAccountModel => ({
  name: "John Doe",
  email: "johndoe@email.com",
  password: "johndoepwd123",
});

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(_value: string): Promise<string> {
      return "hashed_password";
    }
  }

  return new EncrypterStub();
};

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(_data: IAddAccountModel): Promise<IAccountModel> {
      return makeFakeAccount();
    }
  }

  return new AddAccountRepositoryStub();
};

const makeSut = (): IMakeSut => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();

  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return { sut, encrypterStub, addAccountRepositoryStub };
};

describe("DbAddAccount UseCase", () => {
  test("should  call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

    const accountData = makeFakeAccountData();

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

    const accountData = makeFakeAccountData();

    const account = sut.add(accountData);

    await expect(account).rejects.toThrow();
  });

  test("should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const repositoryAddSpy = jest.spyOn(addAccountRepositoryStub, "add");

    const accountData = makeFakeAccountData();

    await sut.add(accountData);

    expect(repositoryAddSpy).toHaveBeenCalledWith({
      name: "John Doe",
      email: "johndoe@email.com",
      password: "hashed_password",
    });
  });

  test("should throw if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    jest.spyOn(addAccountRepositoryStub, "add").mockReturnValueOnce(
      new Promise((_, reject) => {
        reject(new Error());
      })
    );

    const accountData = makeFakeAccountData();

    const account = sut.add(accountData);

    await expect(account).rejects.toThrow();
  });

  test("should return an account on success", async () => {
    const { sut } = makeSut();

    const accountData = makeFakeAccountData();

    const account = await sut.add(accountData);

    expect(account).toEqual(makeFakeAccount());
  });
});
