import { time } from 'console';
import { Country } from './../users/entities/country.entity';
import { Schedule } from './entities/schedule.entity';

export interface CsvFileLine {
  action: 'ADD' | 'EDIT';
  departureDate: string;
  departureTime: string;
  flightNumber: string;
  departureIATACode: string;
  arrivalIATACode: string;
  aircraftId: string;
  economyPrice: string;
  confirmed: string;
}

export const columnsName: (keyof CsvFileLine)[] = [
  'action',
  'departureDate',
  'departureTime',
  'flightNumber',
  'departureIATACode',
  'arrivalIATACode',
  'aircraftId',
  'economyPrice',
  'confirmed',
];

const validDateRegexp = /\d\d\d\d-\d\d-\d\d$/;

export const isCsvLineValid = (line: CsvFileLine): boolean => {
  if (Object.keys(line).length !== columnsName.length) return false;
  if (!line.departureDate.match(validDateRegexp)) return false;
  if (Number.isNaN(new Date(line.departureDate).getTime())) return false;
  return true;
};

export const filterCsvLine = (lines: CsvFileLine[]) => {
  const validLines = lines.filter((line) => isCsvLineValid(line));
  const lineMap = new Map<
    `${CsvFileLine['action']}-${CsvFileLine['flightNumber']}-${CsvFileLine['departureDate']}`,
    boolean
  >();

  let duplicateCount = 0;
  const uniqueLines = validLines.filter((line) => {
    const mapKey =
      `${line.action}-${line.flightNumber}-${line.departureDate}` as const;
    if (lineMap.get(mapKey) === true) {
      duplicateCount++;
      return null;
    }
    lineMap.set(mapKey, true);
    return line;
  });

  return {
    invalidLinesCount: lines.length - validLines.length,
    duplicateCount,
    uniqueLines,
  };
};

interface AirAction {
  from: { time: number; country: number };
  to: { time: number; country: number };
  scheduleId: number;
}

interface TimeLineItem<T = 'to' | 'from'> {
  type: T;
  time: number;
  country: number;
  scheduleId: number;
  dest: T extends 'to' ? null : { country: number; time: number };
}

export const getRoutes = (schedules: Schedule[], from: number, to: number) => {
  const actions = schedules.map<AirAction>((schedule) => ({
    scheduleId: schedule.id,
    from: {
      time: new Date(`${schedule.date} ${schedule.time}`).getTime(),
      country: schedule.route.departureAirport.country.id,
    },
    to: {
      time:
        new Date(`${schedule.date} ${schedule.time}`).getTime() +
        schedule.route.flightTime * 60 * 1000,
      country: schedule.route.arrivalAirport.country.id,
    },
  }));

  actions.sort((action1, action2) => action1.from.time - action2.from.time);

  const countries = new Set(
    actions.flatMap((action) => [action.from.country, action.to.country]),
  );

  const timeline: TimeLineItem[] = actions.flatMap<TimeLineItem>((action) => [
    {
      type: 'from',
      time: action.from.time,
      country: action.from.country,
      scheduleId: action.scheduleId,
      dest: { country: action.to.country, time: action.to.country },
    },
    {
      type: 'to',
      time: action.to.time,
      country: action.to.country,
      scheduleId: action.scheduleId,
      dest: null,
    },
  ]);

  timeline.sort((t1, t2) => t1.time - t2.time);

  // X - time
  // Y - country
  // val - routeId list (from)
  const dpMap: number[][][] = Array(countries.size)
    .fill(null)
    .map(() =>
      Array(timeline.length)
        .fill(null)
        .map(() => []),
    );

  // for (let i = 0; i < actions.length; i++) {
  //   const action = actions[i];
  //   const currentSchedules = dpMap[action.from.time][action.from.country];

  //   let prevSchedules: number[] = [];
  //   for (let j = 0; j < i; j++) {
  //     prevSchedules.concat(dpMap[actions[j]]);
  //   }
  // }

  for (let i = 0; i < timeline.length; i++) {
    const item = timeline[i];
    if (item.type === 'to') continue;

    const currentSchedules = dpMap[item.time][item.country];

    let prevSchedules: number[] = [];
    for (let j = 0; i < i; j++) {
      const prevItem = timeline[j];
      if (prevItem.type === 'from' || prevItem.country !== item.country) {
        continue;
      }
      const schedule = dpMap[prevItem.time][prevItem.country];
      prevSchedules.concat([...schedule]);
    }

    dpMap[item.dest.time][item.dest.country] = [
      ...dpMap[item.dest.time][item.dest.country],
      ...currentSchedules.concat(prevSchedules),
      item.scheduleId,
    ];
  }

  return actions;
};
