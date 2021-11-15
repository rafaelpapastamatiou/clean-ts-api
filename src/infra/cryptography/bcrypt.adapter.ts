import bcrypt from "bcrypt";

import { IEncrypter } from "../../data/protocols/encrypter";

export class BcryptAdapter implements IEncrypter {
  constructor(private salt: number) {}

  async encrypt(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt);

    return hashedValue;
  }
}
