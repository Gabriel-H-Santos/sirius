import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { UuidParamPipe } from '../../../../common/pipes/uuid-param.pipe';
import { GetTutorUseCase } from '../../application/use-cases/get-tutor.use-case';
import { RegisterTutorUseCase } from '../../application/use-cases/register-tutor.use-case';
import { RegisterTutorDto } from '../dtos/register-tutor.dto';
import { toTutorResponse, TutorResponse } from '../mappers/tutor.mapper';

@Controller('tutors')
export class TutorController {
  constructor(
    private readonly registerTutor: RegisterTutorUseCase,
    private readonly getTutor: GetTutorUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterTutorDto): Promise<TutorResponse> {
    return toTutorResponse(await this.registerTutor.execute(dto));
  }

  @Get(':id')
  async getById(@Param('id', UuidParamPipe) id: string): Promise<TutorResponse> {
    return toTutorResponse(await this.getTutor.execute(id));
  }
}
