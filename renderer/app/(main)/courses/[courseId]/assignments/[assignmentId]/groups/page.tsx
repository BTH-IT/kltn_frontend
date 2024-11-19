import { AssignmentGroupList } from '@/components/pages/courses/assignment/AssignmentGroupList';
import AssigmentSubmited from '@/components/pages/courses/assignment/AssignmentSubmited';
import FinalAssigmentSubmited from '@/components/pages/courses/assignment/FinalAssignmentSubmited';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';

import { IAssignment, ISubmissionList } from '@/types';

const AssignmentSubmitPage = async ({ params }: { params: { courseId: string; assignmentId: string } }) => {
  const {
    payload: { data: submissions },
  } = await http.get<ISubmissionList[]>(`${API_URL.ASSIGNMENTS}/${params.assignmentId}${API_URL.SUBMISSIONS}`);
  const {
    payload: { data: assignment },
  } = await http.get<IAssignment>(`${API_URL.ASSIGNMENTS}/${params.assignmentId}`);

  return (
    <>
      {assignment.type === 'Final' ? (
        <FinalAssigmentSubmited submissions={submissions} />
      ) : (
        <>
          {assignment.groups.length > 0 ? (
            <AssignmentGroupList assignment={assignment} />
          ) : (
            <AssigmentSubmited submissions={submissions} />
          )}
        </>
      )}
    </>
  );
};

export default AssignmentSubmitPage;
