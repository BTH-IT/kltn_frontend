import { IBaseModel } from '.';

export interface IComment extends IBaseModel {
  CommentId: string;
  AnnoucementId: string;
  UserId: string;
  Content: string;
}
