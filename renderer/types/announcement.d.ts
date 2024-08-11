import { IBaseModel } from '.';

export interface IAnnouncement extends IBaseModel {
  AnnouncementId: string;
  CourseId: string;
  UserId: string;
  Content: string;
  pin: string;
  attachments?: any;
  AttachedLinks?: any;
  createdAt: string;
  updatedAt: string;
}
