import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsEntity } from './entity/contacts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactsEntity])],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
