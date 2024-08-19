import { IBaseModel } from '.';

export interface IAnnouncement extends IBaseModel {
  announcementId: string;
  courseId: string;
  userId: string;
  content: string;
  pin: string;
  attachments?: any;
  attachedLinks?: any;
}
