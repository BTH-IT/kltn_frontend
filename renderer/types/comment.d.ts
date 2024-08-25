import { IBaseModel, IUser } from '.';

export interface IComment extends IBaseModel {
  commentId: string;
  announcementId: string;
  content: string;
  ownerUserId: string;
  user?: IUser;
}
