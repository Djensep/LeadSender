import { Module } from '@nestjs/common';
import { AmoService } from './amo.service';
import { AmoController } from './amo.controller';

@Module({
  controllers: [AmoController],
  providers: [AmoService],
})
export class AmoModule {}
