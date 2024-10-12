import { IScoreStructure } from './score-structure';

export interface ITranscript {
  id: string;
  fullName: string;
  scores: IScoreStructure;
}
