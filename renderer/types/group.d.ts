import { IBaseModel } from '.';

export interface IGroup extends IBaseModel {
  groupId: string;
  courseId: string;
  groupName: string;
  projectId: string;
  numberOfMembers: number;
  project?: any;
}
