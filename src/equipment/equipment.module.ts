import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';

@Module({
  providers: [EquipmentService],
  controllers: [EquipmentController]
})
export class EquipmentModule {}
