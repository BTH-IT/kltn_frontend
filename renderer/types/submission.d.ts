import { IUser } from './user';

export interface ISubmission {
  submissionId: string;
  assignmentId: string;
  title: string;
  description: string;
  attachments: any;
  attachedLinks: any;
  createdAt: string;
  updatedAt: string;
  createUser: IUser;
}

export interface ISubmissionList {
  score: number | null;
  submission: ISubmission | null;
  user: IUser;
}
