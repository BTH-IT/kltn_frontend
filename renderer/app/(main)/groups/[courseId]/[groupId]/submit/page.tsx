import SubmitProject from '@/components/pages/groups/SubmitProject';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';
import { IAssignment, IGroup } from '@/types';

const GroupSubmitPage = async ({ params }: { params: any }) => {
  const [groupData, assignmentData] = await Promise.all([
    http.get<IGroup>(`${API_URL.GROUPS}/${params.groupId}`),
    http.get<IAssignment>(`${API_URL.COURSES}/${params.courseId}/end-term`),
  ]);

  const group = groupData.payload?.data;
  const assignment = assignmentData.payload?.data;

  return <SubmitProject group={group} data={assignment} />;
};

export default GroupSubmitPage;
