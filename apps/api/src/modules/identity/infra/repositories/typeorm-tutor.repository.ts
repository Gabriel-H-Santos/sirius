import { Repository } from 'typeorm';
import { Tutor } from '../../domain/entities/tutor.entity';
import { TutorRepository } from '../../domain/repositories/tutor.repository';
import { TutorRow } from '../persistence/tutor.schema';

export class TypeormTutorRepository implements TutorRepository {
  constructor(private readonly rows: Repository<TutorRow>) {}

  async save(tutor: Tutor): Promise<void> {
    await this.rows.save({
      id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      createdAt: tutor.createdAt,
      updatedAt: tutor.updatedAt,
    });
  }

  async findById(id: string): Promise<Tutor | null> {
    const row = await this.rows.findOneBy({ id });
    return row ? Tutor.restore(row) : null;
  }

  async findByEmail(email: string): Promise<Tutor | null> {
    const row = await this.rows.findOneBy({ email });
    return row ? Tutor.restore(row) : null;
  }
}
