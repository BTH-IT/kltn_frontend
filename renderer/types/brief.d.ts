import { IBaseModel, ICourse } from '.';

export interface IBrief extends IBaseModel {
  id: string;
  groupId: string;
  group?: ICourse;
  content: string;
  title: string;
}
