export abstract class DomainError extends Error {
  protected constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export abstract class NotFoundError extends DomainError {}

export abstract class ConflictError extends DomainError {}

export abstract class InvalidInputError extends DomainError {}
