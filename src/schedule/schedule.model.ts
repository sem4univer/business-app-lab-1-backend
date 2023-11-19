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
