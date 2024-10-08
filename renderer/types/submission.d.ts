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
  createUser: IUser | null;
}
