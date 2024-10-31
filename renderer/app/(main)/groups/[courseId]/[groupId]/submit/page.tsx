import SubmitProject from '@/components/pages/groups/SubmitProject';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';
import { IAssignment, IGroup } from '@/types';

const GroupSubmitPage = async ({ params }: { params: { courseId: string; groupId: string } }) => {
  const {
    payload: { data: group },
  } = await http.get<IGroup>(`${API_URL.GROUPS}/${params.groupId}`);
  const {
    payload: { data: assignment },
  } = await http.get<IAssignment>(`${API_URL.COURSES}/${params.courseId}/end-term`);
  return <SubmitProject group={group} assignment={assignment} />;
};

export default GroupSubmitPage;
