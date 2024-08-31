import { IBaseModel } from '.';
import { IGroupMember } from './group-member';

export interface IGroup extends IBaseModel {
  groupId: string;
  courseId: string;
  groupName: string;
  projectId?: string;
  numberOfMembers: number;
  project?: any;
  isApproved: boolean;
  groupMembers?: IGroupMember[];
}
