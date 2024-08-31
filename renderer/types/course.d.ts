import { IAnnouncement } from './announcement';
import { ISubject } from './subject';
import { IUser } from './user';

export interface ICourse {
  name: any;
  courseId: string;
  subjectId: string;
  semesterId: string;
  courseGroup: string;
  background: string | null;
  inviteCode: string;
  enableInvite: boolean;
  lecturerId: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  subject?: ISubject;
  lecturer?: IUser;
  semester?: any;
  students: IUser[];
  announcements: IAnnouncement[];
}
