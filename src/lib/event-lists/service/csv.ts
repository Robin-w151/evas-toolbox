import type { CsvData } from '../model/csv-data';
import { parse as csvParse } from 'csv/browser/esm';

export async function parse(file: File): Promise<CsvData> {
  const data = await readFile(file);

  return new Promise((resolve, reject) => {
    csvParse(data, { cast: true, columns: true }, (error, records, info) => {
      if (error) {
        reject(error);
      } else {
        const header = Array.isArray(info.columns)
          ? info.columns.filter((data) => 'name' in data).map(({ name }) => name)
          : [];

        if (header.length > 0) {
          resolve({
            header,
            records,
            total: info.records,
          });
        } else {
          reject(new Error('No columns found!'));
        }
      }
    });
  });
}

export function deduplicate(data?: CsvData, keyColumn?: string): CsvData | undefined {
  if (!data || !keyColumn) {
    return data;
  }

  const map = new Map<string, any>();
  data.records.forEach((record) => {
    const key = record[keyColumn];
    if (key && !map.has(key)) {
      map.set(key, record);
    }
  });

  return {
    ...data,
    records: [...map.values()],
  };
}

function readFile(file: File): Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error as Error);
    reader.readAsText(file);
  });
}
