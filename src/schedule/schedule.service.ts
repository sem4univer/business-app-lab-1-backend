import { Schedule } from './entities/schedule.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  public async findAll(): Promise<Schedule[]> {
    const schedules = await this.scheduleRepository.find({
      relations: {
        aircraft: true,
        route: {
          departureAirport: {
            country: true,
          },
          arrivalAirport: {
            country: true,
          },
        },
      },
    });
    return schedules;
  }
}
