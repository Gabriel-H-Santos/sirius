import { Tutor } from '@modules/identity/domain/entities/tutor.entity';

export interface TutorResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export function toTutorResponse(tutor: Tutor): TutorResponse {
  return {
    id: tutor.id,
    name: tutor.name,
    email: tutor.email,
    createdAt: tutor.createdAt,
  };
}
