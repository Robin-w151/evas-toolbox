import type { CsvData } from './csv-data';

export interface Lookup {
  data?: CsvData;
  dataKeyColumn?: string;
  dataSearchColumns?: Array<string>;
  reference?: CsvData;
  referenceKeyColumn?: string;
  referenceSearchColumns?: Array<string>;
}

export interface LookupResult {
  matches: CsvData;
  unassigned?: LookupResultUnassigned;
}

export interface LookupResultUnassigned {
  dataHeader: Array<string>;
  referenceHeader: Array<string>;
  candidateMappings: Array<LookupResultCandidateMapping>;
}

export interface LookupResultCandidateMapping {
  dataRecord: any;
  candidates: Array<any>;
}
