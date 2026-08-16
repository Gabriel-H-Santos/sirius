import { GetTutorUseCase } from '@modules/identity/application/use-cases/get-tutor.use-case';
import { TutorNotFoundError } from '@modules/identity/domain/errors/tutor-not-found.error';
import { tutorFactory } from '@factories/tutor.factory';
import { FakeTutorRepository } from '@test/modules/identity/infra/repositories/fake-tutor.repository';

describe('GetTutorUseCase', () => {
  let tutorRepository: FakeTutorRepository;
  let useCase: GetTutorUseCase;

  beforeEach(() => {
    tutorRepository = new FakeTutorRepository();
    useCase = new GetTutorUseCase(tutorRepository);
  });

  describe('execute', () => {
    it('returns the tutor when it exists', async () => {
      const tutor = tutorFactory.build();
      tutorRepository.seed(tutor);

      const found = await useCase.execute(tutor.id);

      expect(found).toBe(tutor);
    });

    it('throws when the tutor does not exist', async () => {
      await expect(useCase.execute('01a009db-fc3c-707d-a04a-cb812dcd9999')).rejects.toThrow(
        TutorNotFoundError,
      );
    });
  });
});
