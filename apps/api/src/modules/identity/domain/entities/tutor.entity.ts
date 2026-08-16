import { v7 as uuidv7 } from 'uuid';
import { InvalidTutorError } from '@modules/identity/domain/errors/invalid-tutor.error';

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 120;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface TutorProps {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Tutor {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: TutorProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(input: { name: string; email: string }): Tutor {
    const name = input.name.trim();
    const email = Tutor.normalizeEmail(input.email);

    if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
      throw new InvalidTutorError(
        `name must have between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters`,
      );
    }
    if (!EMAIL_PATTERN.test(email)) {
      throw new InvalidTutorError('email format is invalid');
    }

    const now = new Date();
    return new Tutor({ id: uuidv7(), name, email, createdAt: now, updatedAt: now });
  }

  static restore(props: TutorProps): Tutor {
    return new Tutor(props);
  }

  static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
