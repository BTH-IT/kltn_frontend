import { IBaseModel, IUser } from '.';

export interface IComment extends IBaseModel {
  commentId: string;
  commentableId: string;
  commentableType: string;
  content: string;
  userId: string;
  user?: IUser;
}
