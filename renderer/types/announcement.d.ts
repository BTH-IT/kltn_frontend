import { IBaseModel, ICourse } from '.';

export interface IAnnouncement extends IBaseModel {
  announcementId: string;
  courseId: string;
  userId: string;
  content: string;
  attachedLinks?: any;
  createUser?: any;
  course?: ICourse;
  pin?: string;
  attachments?: any;
  attachedLinks?: any;
}
