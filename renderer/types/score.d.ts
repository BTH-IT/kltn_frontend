import { ISubmission } from './submission';

export interface IScore {
  scoreId: string;
  submissionId: string;
  createdAt: string;
  updatedAt: string;
  value: number;
  submission: ISubmission | null;
}
