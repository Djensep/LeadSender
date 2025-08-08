import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsEntity } from './entity/contacts.entity';
import { AmoModule } from 'src/amo/amo.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactsEntity]), AmoModule],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
