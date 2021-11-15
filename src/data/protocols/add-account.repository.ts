import { IAccountModel } from "../../domain/models/account";
import { IAddAccountModel } from "../../domain/useCases/add-account";

export interface IAddAccountRepository {
  add(data: IAddAccountModel): Promise<IAccountModel>;
}
