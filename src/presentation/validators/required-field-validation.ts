import { MissingParamError } from "../errors";
import { IValidation } from "../protocols/validation";

export class RequiredFieldValidation implements IValidation {
  constructor(private fieldName: string) {}

  async validate(data: Record<string, unknown>): Promise<Error | undefined> {
    if (!data[this.fieldName]) return new MissingParamError(this.fieldName);

    return undefined;
  }
}
