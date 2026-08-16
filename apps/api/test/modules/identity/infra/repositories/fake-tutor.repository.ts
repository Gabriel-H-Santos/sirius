import { Tutor } from '@modules/identity/domain/entities/tutor.entity';
import { EmailAlreadyRegisteredError } from '@modules/identity/domain/errors/email-already-registered.error';
import { TutorRepository } from '@modules/identity/domain/repositories/tutor.repository';

export class FakeTutorRepository implements TutorRepository {
  private rows = new Map<string, Tutor>();

  async save(tutor: Tutor): Promise<void> {
    const conflicting = [...this.rows.values()].some(
      (row) => row.email === tutor.email && row.id !== tutor.id,
    );
    if (conflicting) {
      throw new EmailAlreadyRegisteredError(tutor.email);
    }
    this.rows.set(tutor.id, tutor);
  }

  async findById(id: string): Promise<Tutor | null> {
    return this.rows.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<Tutor | null> {
    return [...this.rows.values()].find((row) => row.email === email) ?? null;
  }

  seed(...tutors: Tutor[]): void {
    for (const tutor of tutors) {
      this.rows.set(tutor.id, tutor);
    }
  }

  count(): number {
    return this.rows.size;
  }

  clear(): void {
    this.rows = new Map();
  }
}
