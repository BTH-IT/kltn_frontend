import { IGroupMember } from './group-member';

import { IBaseModel, IProject } from '.';

export interface IGroup extends IBaseModel {
  groupId: string;
  courseId: string;
  groupName: string;
  projectId?: string;
  numberOfMembers: number;
  project?: IProject;
  isApproved: boolean;
  groupMembers?: IGroupMember[];
}
