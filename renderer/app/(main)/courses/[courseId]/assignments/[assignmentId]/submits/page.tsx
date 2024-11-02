import React from 'react';

import AssigmentSubmited from '@/components/pages/courses/assignment/AssignmentSubmited';
import http from '@/libs/http';
import { ISubmissionList } from '@/types';
import { API_URL } from '@/constants/endpoints';
import FinalAssigmentSubmited from '@/components/pages/courses/assignment/FinalAssignmentSubmited';

const AssignmentSubmitPage = async ({ params }: { params: { courseId: string; assignmentId: string } }) => {
  const {
    payload: { data: submissions },
  } = await http.get<ISubmissionList[]>(`${API_URL.ASSIGNMENTS}/${params.assignmentId}${API_URL.SUBMISSIONS}`);

  return (
    <>
      {submissions[0].groupId ? (
        <FinalAssigmentSubmited submissions={submissions} />
      ) : (
        <AssigmentSubmited submissions={submissions} />
      )}
    </>
  );
};

export default AssignmentSubmitPage;
