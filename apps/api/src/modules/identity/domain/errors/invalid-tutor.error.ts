import { InvalidInputError } from '../../../../common/errors/domain.error';

export class InvalidTutorError extends InvalidInputError {
  constructor(message: string) {
    super(message, 'INVALID_TUTOR');
  }
}
