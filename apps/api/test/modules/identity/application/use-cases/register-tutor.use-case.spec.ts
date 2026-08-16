import { RegisterTutorUseCase } from '@modules/identity/application/use-cases/register-tutor.use-case';
import { EmailAlreadyRegisteredError } from '@modules/identity/domain/errors/email-already-registered.error';
import { InvalidTutorError } from '@modules/identity/domain/errors/invalid-tutor.error';
import { tutorFactory } from '@factories/tutor.factory';
import { FakeTutorRepository } from '@test/modules/identity/infra/repositories/fake-tutor.repository';

describe('RegisterTutorUseCase', () => {
  let tutorRepository: FakeTutorRepository;
  let useCase: RegisterTutorUseCase;

  beforeEach(() => {
    tutorRepository = new FakeTutorRepository();
    useCase = new RegisterTutorUseCase(tutorRepository);
  });

  describe('execute', () => {
    it('registers a tutor and persists the normalized state', async () => {
      const tutor = await useCase.execute({
        name: '  Ana Souza  ',
        email: '  Ana.Souza@Mail.COM ',
      });

      const stored = await tutorRepository.findByEmail('ana.souza@mail.com');
      expect(stored?.id).toBe(tutor.id);
      expect(stored?.name).toBe('Ana Souza');
      expect(tutorRepository.count()).toBe(1);
    });

    it('rejects an email already registered, even with a different casing', async () => {
      tutorRepository.seed(tutorFactory.build({ email: 'ana.souza@mail.com' }));

      await expect(
        useCase.execute({ name: 'Ana S.', email: 'ANA.SOUZA@mail.com' }),
      ).rejects.toThrow(EmailAlreadyRegisteredError);
      expect(tutorRepository.count()).toBe(1);
    });

    it('rejects invalid input without persisting anything', async () => {
      await expect(useCase.execute({ name: 'X', email: 'ana@mail.com' })).rejects.toThrow(
        InvalidTutorError,
      );
      expect(tutorRepository.count()).toBe(0);
    });
  });
});
