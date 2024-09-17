import React from 'react';

import { Accordion } from '@/components/ui/accordion';
import { IAssignment } from '@/types/assignment';

import AssignmentAccordion from './AssignmentAccordion';

const AssignmentList = ({
  assignments,
  setAssignments,
  isTeacher,
}: {
  assignments: IAssignment[];
  setAssignments: React.Dispatch<React.SetStateAction<IAssignment[]>>;
  isTeacher: boolean;
}) => {
  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <div className="flex justify-center w-full">
      <Accordion type="single" collapsible className="flex flex-col w-full max-w-[760px] gap-4">
        {sortedAssignments.map((assignment) => (
          <AssignmentAccordion
            key={assignment.assignmentId}
            assignment={assignment}
            setAssignments={setAssignments}
            isTeacher={isTeacher}
            type={'homeWork'}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default AssignmentList;
