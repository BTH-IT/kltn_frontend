import { IGroupMember } from './group-member';

import { IBaseModel, IBrief, ICourse, IProject, IUser } from '.';

export interface IGroup extends IBaseModel {
  groupId: string;
  courseId: string;
  course: ICourse;
  groupName: string;
  projectId?: string;
  numberOfMembers: number;
  project?: IProject;
  isApproved: boolean;
  groupMembers?: IGroupMember[];
  briefs?: IBrief[];
  requests?: IRequest[];
  assignmentId?: string;
  groupType: string;
}

export interface IRequest extends IBaseModel {
  requestId: string;
  userId: string;
  groupId: string;
  group?: IGroup;
  user?: IUser;
}
