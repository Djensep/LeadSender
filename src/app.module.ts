import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmoModule } from './amo/amo.module';
import { DealsModule } from './deals/deals.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [AmoModule, DealsModule, ContactsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
