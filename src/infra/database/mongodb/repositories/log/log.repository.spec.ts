import { Collection } from "mongodb";

import { MongoHelper } from "../../helpers/mongo-helper";
import { MongoLogRepository } from "./log.repository";

describe("MongoDb Log Repository", () => {
  let errorsLogCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorsLogCollection = MongoHelper.getCollection("log_errors");
    await errorsLogCollection.deleteMany({});
  });

  const makeSut = (): MongoLogRepository => {
    return new MongoLogRepository();
  };

  test("should create an error", async () => {
    const sut = makeSut();

    await sut.logError("any_error");

    const count = await errorsLogCollection.countDocuments();

    expect(count).toBe(1);
  });
});
