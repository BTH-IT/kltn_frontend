import { IBaseModel } from '.';

export interface IGroupMember extends IBaseModel {
  StudentId: string;
  GroupId: string;
  IsLeader: boolean;
}
