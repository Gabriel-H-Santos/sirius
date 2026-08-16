import { Tutor } from '../../domain/entities/tutor.entity';
import { EmailAlreadyRegisteredError } from '../../domain/errors/email-already-registered.error';
import { TutorRepository } from '../../domain/repositories/tutor.repository';

export interface RegisterTutorInput {
  name: string;
  email: string;
}

export class RegisterTutorUseCase {
  constructor(private readonly tutors: TutorRepository) {}

  async execute(input: RegisterTutorInput): Promise<Tutor> {
    const email = Tutor.normalizeEmail(input.email);
    const existing = await this.tutors.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyRegisteredError(email);
    }

    const tutor = Tutor.create(input);
    await this.tutors.save(tutor);
    return tutor;
  }
}
