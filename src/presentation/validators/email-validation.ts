import { InvalidParamError } from "../errors";
import { IEmailValidator } from "../protocols/email-validator";
import { IValidation } from "./validation";

export class EmailValidation implements IValidation {
  constructor(
    private fieldName: string,
    private emailValidator: IEmailValidator
  ) {}

  async validate(data: Record<string, unknown>): Promise<Error | undefined> {
    const isEmailValid = this.emailValidator.isValid(
      data[this.fieldName] as string
    );

    if (!isEmailValid) return new InvalidParamError(this.fieldName);

    return undefined;
  }
}
