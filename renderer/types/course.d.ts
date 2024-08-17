export interface ICourse {
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
  subjectName: string;
  semesterName: string;
  lecturerName: string;
}
