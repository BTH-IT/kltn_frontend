import { IBaseModel } from '.';

export interface IProject extends IBaseModel {
  ProjectId: string;
  SubjectId: string;
  CreateUserId: string;
  Name: string;
  Description: string;
  IsApproved: boolean;
  Title: string;
}
