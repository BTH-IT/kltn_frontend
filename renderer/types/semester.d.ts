import { IBaseModel } from '.';

export interface ISemester extends IBaseModel {
  semesterId: string;
  name: string;
  startDate: Date;
  endDate: Date;
}
