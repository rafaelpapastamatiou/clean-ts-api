export interface IValidation {
  validate(data: Record<string, unknown>): Promise<Error | undefined>;
}
