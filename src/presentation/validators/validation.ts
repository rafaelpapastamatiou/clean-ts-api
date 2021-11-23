export interface IValidation {
  validate(data: Record<string, unknown>): Promise<void>;
}
