import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, In } from 'typeorm';
import { parse } from 'csv-parse/sync';

import { Schedule } from './entities/schedule.entity';
import {
  CsvFileLine,
  columnsName,
  filterCsvLine,
  getRoutes,
} from './schedule.model';
import { Aircraft } from './entities/aircraft.entity';
import { Route } from './entities/route.entity';
import { Airport } from './entities/airport.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Aircraft)
    private aircraftRepository: Repository<Aircraft>,
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
  ) {}

  public async findAll(): Promise<any[]> {
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
    // return getRoutes(
    //   schedules,
    //   schedules[0].route.arrivalAirport.country.id,
    //   schedules[0].route.arrivalAirport.country.id,
    // );
    return schedules;
  }

  public async handleCsv(file: Buffer) {
    const parsedData = parse(file, {
      columns: columnsName,
      relaxColumnCountLess: true,
    }) as CsvFileLine[];

    let { uniqueLines, duplicateCount, invalidLinesCount } =
      filterCsvLine(parsedData);
    for (const data of uniqueLines) {
      if (data.action === 'ADD') {
        const existedSchedule = await this.scheduleRepository.findOne({
          where: {
            date: data.departureDate,
            flightNumber: data.flightNumber,
          },
        });
        if (existedSchedule) {
          invalidLinesCount++;
          continue;
        }

        const schedule = await this.scheduleRepository.create(
          await this.getSchedulePayload(data),
        );

        await this.scheduleRepository.save(schedule);
        continue;
      }
      const existedSchedule = await this.scheduleRepository.findOne({
        where: {
          date: data.departureDate,
          flightNumber: data.flightNumber,
        },
        relations: {
          route: {
            departureAirport: true,
            arrivalAirport: true,
          },
          aircraft: true,
        },
      });

      if (!existedSchedule) {
        invalidLinesCount++;
        continue;
      }

      await this.scheduleRepository.update(
        existedSchedule,
        await this.getSchedulePayload(data),
      );
    }

    return {
      duplicateCount,
      invalidCount: invalidLinesCount,
      successCount: parsedData.length - invalidLinesCount - duplicateCount,
    };
  }
  private async getSchedulePayload(
    data: CsvFileLine,
  ): Promise<DeepPartial<Schedule>> {
    const aircraft = await this.aircraftRepository.findOne({
      where: {
        id: Number(data.aircraftId),
      },
    });
    const route = await this.routeRepository.findOne({
      where: {
        departureAirport: {
          IATACode: data.departureIATACode,
        },
        arrivalAirport: {
          IATACode: data.arrivalIATACode,
        },
      },
    });

    return {
      date: data.departureDate,
      time: data.departureTime,
      economyPrice: Number(data.economyPrice),
      confirmed: data.confirmed === 'OK' ? true : false,
      flightNumber: data.flightNumber,
      aircraft,
      route,
    };
  }
}
