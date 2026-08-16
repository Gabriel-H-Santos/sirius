import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { v7 as uuidv7 } from 'uuid';
import { Tutor, TutorProps } from '@modules/identity/domain/entities/tutor.entity';

export const tutorPropsFactory = Factory.define<TutorProps>(() => ({
  id: uuidv7(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
}));

export const tutorFactory = Factory.define<Tutor>(({ params }) =>
  Tutor.restore(tutorPropsFactory.build(params as Partial<TutorProps>)),
);
