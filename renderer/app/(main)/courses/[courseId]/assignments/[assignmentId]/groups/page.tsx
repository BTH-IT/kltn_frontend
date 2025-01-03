import { Users } from 'lucide-react';

import { AssignmentGroupList } from '@/components/pages/courses/assignment/AssignmentGroupList';
import AssigmentSubmited from '@/components/pages/courses/assignment/AssignmentSubmited';
import FinalAssigmentSubmited from '@/components/pages/courses/assignment/FinalAssignmentSubmited';
import RequestList from '@/components/pages/groups/RequestList';
import TeamMembers from '@/components/pages/groups/TeamMembers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { API_URL } from '@/constants/endpoints';
import { getUserFromCookie } from '@/libs/actions';
import http from '@/libs/http';
import { IAssignment, ISubmissionList } from '@/types';
import { BackButton } from '@/components/common/BackButton';

const AssignmentSubmitPage = async ({ params }: { params: any }) => {
  const {
    payload: { data: submissions },
  } = await http.get<ISubmissionList[]>(`${API_URL.ASSIGNMENTS}/${params.assignmentId}${API_URL.SUBMISSIONS}`);
  const {
    payload: { data: assignment },
  } = await http.get<IAssignment>(`${API_URL.ASSIGNMENTS}/${params.assignmentId}`);

  const user = await getUserFromCookie();

  const group = assignment.groups.find((group) => group?.groupMembers?.some((member) => member.studentId === user?.id));

  if (group && assignment.course.lecturerId !== user?.id) {
    return (
      <div className="mt-4 space-y-6">
        <Card className="text-white bg-gradient-to-r from-blue-500 to-purple-600">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-3xl font-bold">
              <span>{group.groupName}</span>
              <BackButton assignmentId={group?.assignmentId || ''} courseId={group?.courseId || ''} />
            </CardTitle>
            <CardDescription className="text-blue-100">
              Môn học: {assignment?.course?.subject?.name} - Nhóm: {assignment?.course?.courseGroup}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Số lượng thành viên tối đa: {group?.numberOfMembers} Nguời</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <TeamMembers group={group} />

        <RequestList group={group} />
      </div>
    );
  }

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
