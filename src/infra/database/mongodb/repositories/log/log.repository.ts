import { IErrorLogRepository } from "../../../../../data/protocols/error-log.repository";
import { MongoHelper } from "../../helpers/mongo-helper";

export class MongoLogRepository implements IErrorLogRepository {
  async logError(stack: string): Promise<void> {
    const errorsLogCollection = MongoHelper.getCollection("log_errors");

    await errorsLogCollection.insertOne({
      stack,
      date: new Date(),
    });
  }
}
