import type { CsvData } from './csv-data';

export interface Lookup {
  data?: CsvData;
  dataKeyColumn?: string;
  reference?: CsvData;
  referenceKeyColumn?: string;
}

export interface LookupResult {
  matches: CsvData;
  unassigned?: LookupResultUnassigned;
}

export interface LookupResultUnassigned {
  headerLeft: Array<string>;
  headerRight: Array<string>;
  candidateMappings: Array<LookupResultCandidateMapping>;
}

export interface LookupResultCandidateMapping {
  left: any;
  candidates: Array<any>;
}
