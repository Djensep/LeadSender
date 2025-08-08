import { Module } from '@nestjs/common';
import { AmoService } from './amo.service';
import { AmoController } from './amo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmoEntity } from './amo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AmoEntity])],
  controllers: [AmoController],
  providers: [AmoService],
})
export class AmoModule {}
