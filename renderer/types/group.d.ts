import { IGroupMember } from './group-member';

import { IBaseModel, IBrief, ICourse, IProject } from '.';

export interface IGroup extends IBaseModel {
  groupId: string;
  courseId: string;
  course?: ICourse;
  groupName: string;
  projectId?: string;
  numberOfMembers: number;
  project?: IProject;
  isApproved: boolean;
  groupMembers?: IGroupMember[];
  briefs?: IBrief[];
}
