import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TUTOR_REPOSITORY, TutorRepository } from './domain/repositories/tutor.repository';
import { GetTutorUseCase } from './application/use-cases/get-tutor.use-case';
import { RegisterTutorUseCase } from './application/use-cases/register-tutor.use-case';
import { TutorRow, TutorSchema } from './infra/persistence/tutor.schema';
import { TypeormTutorRepository } from './infra/repositories/typeorm-tutor.repository';
import { TutorController } from './presentation/controllers/tutor.controller';

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
