import { QueryFailedError, Repository } from 'typeorm';
import { Tutor } from '../../domain/entities/tutor.entity';
import { EmailAlreadyRegisteredError } from '../../domain/errors/email-already-registered.error';
import { TutorRepository } from '../../domain/repositories/tutor.repository';
import { TutorRow } from '../persistence/tutor.schema';

const UNIQUE_EMAIL_CONSTRAINT = 'uq_tutors_email';

export class TypeormTutorRepository implements TutorRepository {
  constructor(private readonly rows: Repository<TutorRow>) {}

  async save(tutor: Tutor): Promise<void> {
    try {
      await this.rows.save({
        id: tutor.id,
        name: tutor.name,
        email: tutor.email,
        createdAt: tutor.createdAt,
        updatedAt: tutor.updatedAt,
      });
    } catch (error) {
      if (this.isUniqueEmailViolation(error)) {
        throw new EmailAlreadyRegisteredError(tutor.email);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Tutor | null> {
    const row = await this.rows.findOneBy({ id });
    return row ? Tutor.restore(row) : null;
  }

  async findByEmail(email: string): Promise<Tutor | null> {
    const row = await this.rows.findOneBy({ email });
    return row ? Tutor.restore(row) : null;
  }

  private isUniqueEmailViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error.driverError as { constraint?: string }).constraint === UNIQUE_EMAIL_CONSTRAINT
    );
  }
}
