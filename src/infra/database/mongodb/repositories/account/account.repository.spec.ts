import { Collection, Document } from "mongodb";

import { MongoHelper } from "../../helpers/mongo-helper";
import { MongoAccountRepository } from "./account.repository";

describe("MongoDb Account Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountsCollection = MongoHelper.getCollection("accounts");
    await accountsCollection.deleteMany({});
  });

  const makeSut = (): MongoAccountRepository => {
    return new MongoAccountRepository();
  };

  test("should return an account on success ", async () => {
    const sut = makeSut();

    const account = await sut.add({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@email.com");
    expect(account.password).toBe("any_password");
  });

  test("should throw if mongodb can't find created account after insert", async () => {
    const sut = makeSut();

    jest
      .spyOn(MongoHelper, "getCollection")
      .mockImplementationOnce((name: string): Collection<Document> => {
        const collection = MongoHelper.getCollection(name);

        collection.findOne = async () => {
          return null;
        };

        return collection;
      });

    const promise = sut.add({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });

    await expect(promise).rejects.toThrow();
  });
});
