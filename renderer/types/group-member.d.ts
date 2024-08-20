import { IBaseModel } from '.';

export interface IGroupMember extends IBaseModel {
  studentId: string;
  groupId: string;
  isLeader: boolean;
  studentObj?: any;
}
