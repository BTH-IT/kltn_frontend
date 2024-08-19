import { IBaseModel } from '.';

export interface IGroup extends IBaseModel {
  studentId: string;
  courseId: string;
}
