import { Body, Controller, Post } from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/createDeal.dto';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  async createDeal(
    @Body()
    dtoData: CreateDealDto,
  ) {
    return this.dealsService.findOrCreateDeal(dtoData);
  }
}
