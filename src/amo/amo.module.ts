import { Module } from '@nestjs/common';
import { AmoService } from './amo.service';
import { AmoController } from './amo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmoEntity } from './amo.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([AmoEntity]), HttpModule],
  controllers: [AmoController],
  providers: [AmoService],
})
export class AmoModule {}
