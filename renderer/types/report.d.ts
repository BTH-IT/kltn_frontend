import { IBaseModel, IBrief, IComment, ICourse, IUser } from '.';

export interface IReport extends IBaseModel {
  reportId: string;
  userId: string;
  groupId: string;
  title: string;
  content: string;
  attachedLinks?: any;
  createUser?: IUser;
  attachments?: any;
  course?: ICourse;
  comments: IComment[];
  brief: IBrief | null;
}
