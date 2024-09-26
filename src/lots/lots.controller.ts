import { Controller, Get, Param } from '@nestjs/common';
import { LotsService } from './lots.service';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Get(':itemCode/:whsCode')
  findOneLot(
    @Param('itemCode') itemCode: string,
    @Param('whsCode') whsCode: string,
  ) {
    return this.lotsService.findLot(itemCode, whsCode);
  }
}
