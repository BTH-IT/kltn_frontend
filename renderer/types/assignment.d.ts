import { IClasses } from './classes';

export interface IAssignment {
  assignmentId: string;
  classId: string;
  title: string;
  content: string;
  dueDate?: string | null;
  scoreStructureId?: string | null;
  attachments: string;
  attachedLinks: string;
  createdAt: string;
  updatedAt: string;
  classes: IClasses;
  studentAssigned: any;
}
