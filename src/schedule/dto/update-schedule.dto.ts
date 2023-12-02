import { ApiProperty } from '@nestjs/swagger';
import { Schedule } from './../entities/schedule.entity';

export class UpdateScheduleDto implements Partial<Schedule> {
  @ApiProperty()
  date?: string;

  @ApiProperty()
  time?: string;

  @ApiProperty()
  economyPrice?: number;
}
