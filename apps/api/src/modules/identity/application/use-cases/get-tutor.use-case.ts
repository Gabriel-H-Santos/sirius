import { Tutor } from '../../domain/entities/tutor.entity';
import { TutorNotFoundError } from '../../domain/errors/tutor-not-found.error';
import { TutorRepository } from '../../domain/repositories/tutor.repository';

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
