import { Module } from '@nestjs/common';
import { TypeormDatasource } from './typeorm/typeorm.module';

@Module({
  imports: [TypeormDatasource],
})
export class DatasourceModule {}
