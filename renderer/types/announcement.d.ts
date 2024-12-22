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
  mentions?: any;
  comments: IComment[];
  type?: string;
  title?: string;
  url?: string;
}
