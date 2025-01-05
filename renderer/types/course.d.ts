import { IAnnouncement } from './announcement';
import { IAssignment } from './assignment';
import { IScoreStructure } from './score-structure';
import { ISubject } from './subject';
import { IUser } from './user';

export interface ICourse {
  name: string;
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
  assignments: IAssignment[];
  scoreStructure: IScoreStructure;
  setting: ISetting;
  saveAt: string | null;
  studentCount: number;
  sourceCourseId?: string;
}

export interface ISetting {
  settingId: string;
  courseId: string;
  startGroupCreation: Date | null;
  endGroupCreation: Date | null;
  dueDateToJoinGroup: Date | null;
  allowStudentCreateProject: boolean;
  allowGroupRegistration: boolean;
  maxGroupSize: number;
  minGroupSize: number;
  hasFinalScore: boolean;
}
