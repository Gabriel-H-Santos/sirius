import { Tutor } from '@modules/identity/domain/entities/tutor.entity';
import { TutorNotFoundError } from '@modules/identity/domain/errors/tutor-not-found.error';
import { TutorRepository } from '@modules/identity/domain/repositories/tutor.repository';

export class GetTutorUseCase {
  constructor(private readonly tutors: TutorRepository) {}

  async execute(id: string): Promise<Tutor> {
    const tutor = await this.tutors.findById(id);
    if (!tutor) {
      throw new TutorNotFoundError(id);
    }
    return tutor;
  }
}
