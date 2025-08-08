import { Module } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsEntity } from './entity/deals.entity';
import { AmoModule } from 'src/amo/amo.module';
import { ContactsModule } from 'src/contacts/contacts.module';

@Module({
  imports: [TypeOrmModule.forFeature([DealsEntity]), ContactsModule, AmoModule],
  controllers: [DealsController],
  providers: [DealsService],
})
export class DealsModule {}
