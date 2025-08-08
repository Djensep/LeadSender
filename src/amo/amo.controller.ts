import { Controller } from '@nestjs/common';
import { AmoService } from './amo.service';

@Controller('amo')
export class AmoController {
  constructor(private readonly amoService: AmoService) {}
}
