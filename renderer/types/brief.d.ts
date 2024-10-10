import { IBaseModel, ICourse } from '.';

export interface IBrief extends IBaseModel {
  briefId: string;
  groupId: string;
  group?: ICourse;
  content: string;
  title: string;
}
