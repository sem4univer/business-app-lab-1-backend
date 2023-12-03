import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterSchedules {
  @ApiPropertyOptional()
  airportFrom?: string;

  @ApiPropertyOptional()
  airportTo?: string;

  @ApiPropertyOptional()
  departureDate?: string;

  @ApiPropertyOptional()
  flightNumber?: number;
}
