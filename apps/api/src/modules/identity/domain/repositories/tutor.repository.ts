import { Tutor } from '../entities/tutor.entity';

export const TUTOR_REPOSITORY = Symbol('TUTOR_REPOSITORY');

export interface TutorRepository {
  save(tutor: Tutor): Promise<void>;
  findById(id: string): Promise<Tutor | null>;
  findByEmail(email: string): Promise<Tutor | null>;
}
