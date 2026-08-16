import { EntitySchema } from 'typeorm';

export interface TutorRow {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export const TutorSchema = new EntitySchema<TutorRow>({
  name: 'tutors',
  tableName: 'tutors',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      primaryKeyConstraintName: 'pk_tutors',
    },
    name: {
      type: 'varchar',
      length: 120,
    },
    email: {
      type: 'varchar',
      length: 254,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamptz',
      updateDate: true,
    },
  },
  indices: [
    {
      name: 'uq_tutors_email',
      columns: ['email'],
      unique: true,
    },
  ],
});
