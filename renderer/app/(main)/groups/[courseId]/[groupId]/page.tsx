/* eslint-disable no-unused-vars */
import Charts from '@/components/pages/groups/Charts';
import OverviewHeader from '@/components/pages/groups/OverviewHeader';
import WeeklySummary from '@/components/pages/groups/WeeklySummary';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';
import { IGroup } from '@/types/group';

const GroupDetailPage = async ({ params }: { params: { courseId: string; groupId: string } }) => {
  const {
    payload: { data: group },
  } = await http.get<IGroup>(`${API_URL.GROUPS}/${params.groupId}`);

  return (
    <div>
      <OverviewHeader />
      <Charts />
      <WeeklySummary />
    </div>
  );
};

export default GroupDetailPage;
