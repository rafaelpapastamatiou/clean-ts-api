import { IValidation } from "../protocols/validation";

export class ValidationComposite implements IValidation {
  constructor(private validations: IValidation[]) {}

  async validate(data: Record<string, unknown>): Promise<Error | undefined> {
    for (const validation of this.validations) {
      const error = await validation.validate(data);

      if (error) return error;
    }

    return undefined;
  }
}
