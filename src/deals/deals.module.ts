import { Module } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsEntity } from './entity/deals.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DealsEntity])],
  controllers: [DealsController],
  providers: [DealsService],
})
export class DealsModule {}
