export interface ICourse {
  name: any;
  classId: any;
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
  subject?: any;
  lecturer?: any;
  semester?: any;
}
