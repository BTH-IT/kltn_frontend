import { IBaseModel } from '.';

export interface IProject extends IBaseModel {
  projectId: string;
  subjectId: string;
  createUserId: string;
  title: string;
  description: string;
  isApproved: boolean;
  subject?: any;
  createUser?: any;
}
