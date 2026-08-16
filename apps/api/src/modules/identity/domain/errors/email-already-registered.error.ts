import { ConflictError } from '@common/errors/domain.error';

export class EmailAlreadyRegisteredError extends ConflictError {
  constructor(email: string) {
    super(`email ${email} is already registered`, 'EMAIL_ALREADY_REGISTERED');
  }
}
