import { IBaseModel, IUser } from '.';

export interface IComment extends IBaseModel {
  commentId: string;
  annoucementId: string;
  content: string;
  userId: string;
  user?: IUser;
}
