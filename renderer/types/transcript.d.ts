import { IScoreStructure } from './score-structure';

export interface ITranscript {
  id: string;
  fullName: string;
  scores: IScoreStructure;
}

export interface ITranscriptStatistic {
  columnName: string;
  average: number;
  max: number;
  min: number;
  distribution: { [key: string]: number };
}
