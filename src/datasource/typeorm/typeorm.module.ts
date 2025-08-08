import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormDatasource } from './typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeormDatasource.options)],
})
export class TypeormDatasource {}
