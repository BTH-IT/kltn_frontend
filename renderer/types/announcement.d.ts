import { IBaseModel } from '.';

export interface IAnnouncement extends IBaseModel {
  announcementId: string;
  courseId: string;
  userId: string;
  content: string;
  attachedLinks?: any;
  createUser?: any;
  course?: any;
}
