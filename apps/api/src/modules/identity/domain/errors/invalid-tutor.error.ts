export class InvalidTutorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTutorError';
  }
}
