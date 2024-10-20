import { redirect } from 'next/navigation';

import http from '@/libs/http';
import { API_URL } from '@/constants/endpoints';
import { IGroup } from '@/types/group';
import GroupClient from '@/components/tables/group-tables/client';
import { GroupContextProvider } from '@/contexts/GroupContext';
import { getUserFromCookie } from '@/libs/actions';
import { ICourse } from '@/types';
import { CreateProjectProvider } from '@/contexts/CreateProjectContext';

const GroupsPage = async ({ params }: { params: { courseId: string } }) => {
  const {
    payload: { data: groups },
  } = await http.get<IGroup[]>(`${API_URL.COURSES}/${params.courseId}${API_URL.GROUPS}`);

  const {
    payload: { data: course },
  } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`);

  if (!course) {
    return redirect('/');
  }

  const user = await getUserFromCookie();

  if (groups.length > 0) {
    const currentGroup = groups.find((group) => group.groupMembers?.some((member) => member.studentId === user.id));

    currentGroup && redirect(`/groups/${params.courseId}/${currentGroup.groupId}`);
  }

  return (
    <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
      <CreateProjectProvider projects={[]}>
        <GroupContextProvider groups={groups}>
          <GroupClient user={user} course={course} />
        </GroupContextProvider>
      </CreateProjectProvider>
    </div>
  );
};

export default GroupsPage;
