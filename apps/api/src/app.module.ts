import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health.controller';
import { IdentityModule } from './modules/identity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    DatabaseModule,
    IdentityModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
