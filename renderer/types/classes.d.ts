import { IAnnouncement } from './announcement';
import { IAssignment } from './assignment';
import { ISubject } from './subject';
import { IUser } from './user';

export interface IClasses {
  classId: string;
  name: string;
  inviteCode: string;
  subjectId: string;
  subject: ISubject | null;
  teacherId: string;
  teacher: IUser | null;
  students: IUser[];
  announcements: IAnnouncement[];
  assignments: IAssignment[];
  scoreStructure: any;
  theme: string;
  background: string;
  enableInvite: boolean;
  createdAt: string;
  updatedAt: string;
}
