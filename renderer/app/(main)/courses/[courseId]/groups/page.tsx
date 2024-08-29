import http from '@/libs/http';
import { API_URL } from '@/constants/endpoints';
import { IGroup } from '@/types/group';
import GroupClient from '@/components/tables/group-tables/client';
import { GroupContextProvider } from '@/contexts/GroupContext';

const GroupsPage = async ({ params }: { params: { courseId: string } }) => {
  const {
    payload: { data: groups },
  } = await http.get<IGroup[]>(`${API_URL.COURSES}/${params.courseId}${API_URL.GROUPS}`);

  return (
    <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
      <GroupContextProvider initialGroups={groups}>
        <GroupClient />
      </GroupContextProvider>
    </div>
  );
};

export default GroupsPage;
