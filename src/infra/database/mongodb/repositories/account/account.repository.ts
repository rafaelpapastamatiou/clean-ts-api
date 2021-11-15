import { IAddAccountRepository } from "../../../../../data/protocols/add-account.repository";
import { IAccountModel } from "../../../../../domain/models/account";
import { IAddAccountModel } from "../../../../../domain/useCases/add-account";
import { MongoHelper } from "../../helpers/mongo-helper";

export class MongoAccountRepository implements IAddAccountRepository {
  async add(data: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = MongoHelper.getCollection("accounts");

    const result = await accountCollection.insertOne(data, {});

    const account = await accountCollection.findOne(result.insertedId);

    if (!account) throw new Error("Error saving account to mongodb.");

    return MongoHelper.map<IAccountModel>(account);
  }
}
