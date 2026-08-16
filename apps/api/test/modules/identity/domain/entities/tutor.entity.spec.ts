import { Tutor } from '@modules/identity/domain/entities/tutor.entity';
import { InvalidTutorError } from '@modules/identity/domain/errors/invalid-tutor.error';
import { tutorPropsFactory } from '@factories/tutor.factory';

describe('Tutor', () => {
  describe('create', () => {
    it('creates a tutor with a v7 id and normalized fields', () => {
      const tutor = Tutor.create({ name: '  Ana Souza  ', email: '  Ana.Souza@Mail.COM ' });

      expect(tutor.id[14]).toBe('7');
      expect(tutor.name).toBe('Ana Souza');
      expect(tutor.email).toBe('ana.souza@mail.com');
      expect(tutor.createdAt).toEqual(tutor.updatedAt);
    });

    it('rejects a name shorter than 2 characters', () => {
      expect(() => Tutor.create({ name: 'X', email: 'ana@mail.com' })).toThrow(InvalidTutorError);
    });

    it('rejects a name longer than 120 characters', () => {
      expect(() => Tutor.create({ name: 'a'.repeat(121), email: 'ana@mail.com' })).toThrow(
        InvalidTutorError,
      );
    });

    it('rejects a malformed email', () => {
      expect(() => Tutor.create({ name: 'Ana Souza', email: 'nao-e-email' })).toThrow(
        InvalidTutorError,
      );
    });
  });

  describe('restore', () => {
    it('rebuilds a tutor from stored props without changing them', () => {
      const props = tutorPropsFactory.build();

      const tutor = Tutor.restore(props);

      expect(tutor.id).toBe(props.id);
      expect(tutor.name).toBe(props.name);
      expect(tutor.email).toBe(props.email);
      expect(tutor.createdAt).toBe(props.createdAt);
      expect(tutor.updatedAt).toBe(props.updatedAt);
    });
  });
});
