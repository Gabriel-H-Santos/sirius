import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TUTOR_REPOSITORY, TutorRepository } from '@modules/identity/domain/repositories/tutor.repository';
import { GetTutorUseCase } from '@modules/identity/application/use-cases/get-tutor.use-case';
import { RegisterTutorUseCase } from '@modules/identity/application/use-cases/register-tutor.use-case';
import { TutorRow, TutorSchema } from '@modules/identity/infra/persistence/tutor.schema';
import { TypeormTutorRepository } from '@modules/identity/infra/repositories/typeorm-tutor.repository';
import { TutorController } from '@modules/identity/presentation/controllers/tutor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TutorSchema])],
  controllers: [TutorController],
  providers: [
    {
      provide: TUTOR_REPOSITORY,
      useFactory: (rows: Repository<TutorRow>) => new TypeormTutorRepository(rows),
      inject: [getRepositoryToken(TutorSchema)],
    },
    {
      provide: RegisterTutorUseCase,
      useFactory: (tutors: TutorRepository) => new RegisterTutorUseCase(tutors),
      inject: [TUTOR_REPOSITORY],
    },
    {
      provide: GetTutorUseCase,
      useFactory: (tutors: TutorRepository) => new GetTutorUseCase(tutors),
      inject: [TUTOR_REPOSITORY],
    },
  ],
})
export class IdentityModule {}
