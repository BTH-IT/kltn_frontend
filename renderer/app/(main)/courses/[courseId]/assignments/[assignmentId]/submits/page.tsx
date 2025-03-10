import React from 'react';
import { redirect } from 'next/navigation';

import AssigmentSubmited from '@/components/pages/courses/assignment/AssignmentSubmited';
import http from '@/libs/http';
import { ISubmissionList } from '@/types';
import { API_URL } from '@/constants/endpoints';
import FinalAssigmentSubmited from '@/components/pages/courses/assignment/FinalAssignmentSubmited';

const AssignmentSubmitPage = async ({ params }: { params: any }) => {
  const {
    payload: { data: submissions },
  } = await http.get<ISubmissionList[]>(`${API_URL.ASSIGNMENTS}/${params.assignmentId}${API_URL.SUBMISSIONS}`);

  if (!submissions) {
    redirect('/');
  }

  return (
    <>
      {submissions[0]?.groupId ? (
        <FinalAssigmentSubmited submissions={submissions} />
      ) : (
        <AssigmentSubmited submissions={submissions} />
      )}
    </>
  );
};

export default AssignmentSubmitPage;
