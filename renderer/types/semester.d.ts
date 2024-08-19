import { IBaseModel } from '.';

export interface ISemester extends IBaseModel {
  semesterId: string;
  name: string;
  startDate: string;
  endDate: string;
}
