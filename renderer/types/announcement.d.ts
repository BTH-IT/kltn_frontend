import { IBaseModel, IComment, ICourse, IUser } from '.';

export interface IAnnouncement extends IBaseModel {
  announcementId: string;
  courseId: string;
  userId: string;
  content: string;
  attachedLinks?: any;
  createUser?: IUser;
  course?: ICourse;
  isPinned?: boolean;
  attachments?: any;
  attachedLinks?: any;
  mentions?: any;
  comments: IComment[];
}
