import { NotFoundError } from '@common/errors/domain.error';

export class TutorNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`tutor ${id} was not found`, 'TUTOR_NOT_FOUND');
  }
}
