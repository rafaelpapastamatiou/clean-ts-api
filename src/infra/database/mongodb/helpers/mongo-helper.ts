import { MongoClient, Collection, Document } from "mongodb";

type MongoMappedDocument = {
  id: string;
};

export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
  },
  async disconnect(): Promise<void> {
    await this.client.close();
  },
  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },
  map: <T extends MongoMappedDocument>(document: Document): T => {
    const { _id, ...rest } = document;

    return {
      id: _id,
      ...rest,
    } as T;
  },
};
