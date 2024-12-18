import { IComment } from './comment';
import { ICourse } from './course';
import { IGroup } from './group';
import { ISubmission } from './submission';
import { IUser } from './user';

export interface IAssignment {
  assignmentId: string;
  courseId: string;
  title: string;
  type: string;
  content: string;
  dueDate?: Date | string | null;
  attachments: any;
  attachedLinks: any;
  createdAt: Date | string;
  updatedAt: Date | string;
  course: ICourse;
  createUser: IUser | null;
  isGroupAssigned: boolean;
  IsIndividualSubmissionRequired: boolean;
  scoreStructureId: string;
  scoreStructure: any;
  comments: IComment[];
  submission: ISubmission | null;
  assignmentOptions: any;
  groups: IGroup[];
}
