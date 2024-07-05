import type { CsvData } from '../model/csv-data';
import { parse as csvParse } from 'csv/browser/esm';
import type { Lookup, LookupResult, LookupResultCandidateMapping } from '../model/lookup';

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

export function findEmailColumn(header?: Array<string>): string | undefined {
  return header?.find((h) => /email/i.test(h.replaceAll(/[-_\s]/g, '')));
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

export function lookup(lookup?: Lookup): LookupResult | undefined {
  const { data, dataKeyColumn, reference, referenceKeyColumn } = lookup ?? {};
  if (
    !data ||
    data.records.length === 0 ||
    !reference ||
    reference.records.length === 0 ||
    !dataKeyColumn ||
    !referenceKeyColumn
  ) {
    return;
  }

  const map = new Map<string, any>(
    reference.records.map((record) => [record[referenceKeyColumn], record]),
  );
  const unassigned: Array<any> = [];

  const records = data.records
    .map((record) => {
      const match = map.get(record[dataKeyColumn]);
      if (match) {
        return match;
      }

      unassigned.push(record);
    })
    .filter((match) => !!match);

  let candidateMappings: Array<LookupResultCandidateMapping> | undefined = undefined;
  if (unassigned.length > 0) {
    const referenceWithSerialized = reference.records.map((ref) => [
      ref,
      JSON.stringify(ref).toLowerCase(),
    ]);

    candidateMappings = unassigned
      .map((record) => {
        const candidates = referenceWithSerialized
          .filter(([, serialized]) => {
            for (const key in record) {
              if (serialized.includes(record[key].toLowerCase())) {
                return true;
              }
            }

            return false;
          })
          .map(([ref]) => ref);

        if (candidates?.length > 0) {
          return {
            left: record,
            candidates,
          };
        }
      })
      .filter((mapping) => !!mapping);
  }

  return {
    matches: {
      header: reference.header,
      records,
      total: records.length,
    },
    unassigned: candidateMappings
      ? {
          headerLeft: data.header,
          headerRight: reference.header,
          candidateMappings,
        }
      : undefined,
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
