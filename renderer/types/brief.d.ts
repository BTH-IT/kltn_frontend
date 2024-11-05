import { IBaseModel, IGroup } from '.';

export interface IBrief extends IBaseModel {
  id: string;
  groupId: string;
  reportId: string;
  group?: IGroup;
  content: string;
  title: string;
}
