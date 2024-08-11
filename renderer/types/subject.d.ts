import { IBaseModel } from '.';

export interface ISubject extends IBaseModel {
  SubjectId: string;
  Name: string;
  Description: string;
}
