import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmoModule } from './amo/amo.module';
import { DealsModule } from './deals/deals.module';
import { ContactsModule } from './contacts/contacts.module';
import { DatasourceModule } from './datasource/datasource.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AmoModule,
    DealsModule,
    ContactsModule,
    DatasourceModule,
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
