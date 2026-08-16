import { Injectable, PipeTransform } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { z } from 'zod';

const uuidSchema = z.uuid();

@Injectable()
export class UuidParamPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const result = uuidSchema.safeParse(value);
    if (!result.success) {
      throw new ZodValidationException(result.error);
    }
    return result.data;
  }
}
