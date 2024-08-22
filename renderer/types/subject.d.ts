import { IBaseModel } from '.';

export interface ISubject extends IBaseModel {
  subjectId: string;
  name: string;
  description: string;
  // startDate: Date;
  // endDate: Date;
  subjectCode: string;
}
