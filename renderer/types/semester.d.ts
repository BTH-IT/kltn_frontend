import { IBaseModel } from '.';

export interface ISemester extends IBaseModel {
  SemesterId: string;
  Name: string;
  StartDate: string;
  EndDate: string;
}
