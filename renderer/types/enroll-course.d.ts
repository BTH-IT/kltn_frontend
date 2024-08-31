import { IBaseModel } from '.';

export interface IEnrollCourse extends IBaseModel {
  studentId: string;
  courseId: string;
}
