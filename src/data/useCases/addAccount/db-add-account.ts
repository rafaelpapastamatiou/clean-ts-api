import { IAccountModel } from "../../../domain/models/account";
import {
  IAddAccount,
  IAddAccountModel,
} from "../../../domain/useCases/add-account";
import { IEncrypter } from "../../protocols/encrypter";

export class DbAddAccount implements IAddAccount {
  constructor(private encrypter: IEncrypter) {}

  async add({
    name,
    email,
    password,
  }: IAddAccountModel): Promise<IAccountModel> {
    await this.encrypter.encrypt(password);

    return null as unknown as IAccountModel;
  }
}
