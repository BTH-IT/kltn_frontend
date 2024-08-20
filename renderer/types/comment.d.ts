import { IBaseModel } from '.';

export interface IComment extends IBaseModel {
  commentId: string;
  annoucementId: string;
  content: string;
  ownerUserId: string;
  ownerName: string;
}
