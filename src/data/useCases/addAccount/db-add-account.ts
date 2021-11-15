import {
  IAccountModel,
  IAddAccount,
  IAddAccountModel,
  IAddAccountRepository,
  IEncrypter,
} from "./db-add-account.protocols";

export class DbAddAccount implements IAddAccount {
  constructor(
    private encrypter: IEncrypter,
    private repository: IAddAccountRepository
  ) {}

  async add(data: IAddAccountModel): Promise<IAccountModel> {
    const hashedPassowrd = await this.encrypter.encrypt(data.password);

    const account = await this.repository.add({
      ...data,
      password: hashedPassowrd,
    });

    return account;
  }
}
