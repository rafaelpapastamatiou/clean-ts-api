import { InvalidParamError } from "../errors";
import { IValidation } from "../protocols/validation";

export class CompareFieldsValidation implements IValidation {
  constructor(private fieldName: string, private fieldToCompareName: string) {}

  async validate(data: Record<string, unknown>): Promise<Error | undefined> {
    if (data[this.fieldName] !== data[this.fieldToCompareName])
      return new InvalidParamError(this.fieldToCompareName);

    return undefined;
  }
}
