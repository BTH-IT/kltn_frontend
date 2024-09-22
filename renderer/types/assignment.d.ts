import { ICourse } from './course';
export interface IAssignment {
  assignmentId: string;
  courseId: string;
  title: string;
  content: string;
  dueDate?: string | null;
  attachments: any;
  attachedLinks: any;
  createdAt: string;
  updatedAt: string;
  course: ICourse;
  studentAssigned: any;
}
