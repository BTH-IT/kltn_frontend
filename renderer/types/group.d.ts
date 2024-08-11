import { IBaseModel } from '.';

export interface IGroup extends IBaseModel {
  GroupId: string;
  CourseId: string;
  GroupName: string;
  ProjectId: string;
  NumberOfMembers: number;
}
