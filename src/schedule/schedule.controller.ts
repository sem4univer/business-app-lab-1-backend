import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';

@ApiBearerAuth()
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  get() {
    return this.scheduleService.findAll();
  }
}
