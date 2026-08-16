import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const registerTutorSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().pipe(z.email()),
});

export class RegisterTutorDto extends createZodDto(registerTutorSchema) {}
