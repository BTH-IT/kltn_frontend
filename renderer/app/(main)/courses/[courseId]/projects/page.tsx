import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { IProject } from '@/types/project';
import http from '@/libs/http';
import { API_URL } from '@/constants/endpoints';
import { ProjectClient } from '@/components/tables/project-tables/client';
import { CreateProjectProvider } from '@/contexts/CreateProjectContext';
import { ICourse, IGroup } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';
import { GroupContextProvider } from '@/contexts/GroupContext';

const ProjectsPage = async ({ params }: { params: { courseId: string } }) => {
  const {
    payload: { data: course },
  } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`);

  if (!course) {
    return redirect('/');
  }

  const {
    payload: { data: projects },
  } = await http.get<IProject[]>(`${API_URL.COURSES}/${params.courseId}${API_URL.PROJECTS}`);

  const {
    payload: { data: groups },
  } = await http.get<IGroup[]>(`${API_URL.COURSES}/${params.courseId}${API_URL.GROUPS}`);

  const cookieStore = cookies();
  const userCookie = cookieStore.get(KEY_LOCALSTORAGE.CURRENT_USER)?.value;
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;

  return (
    <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
      <CreateProjectProvider projects={projects}>
        <GroupContextProvider groups={groups}>
          <ProjectClient user={user} />
        </GroupContextProvider>
      </CreateProjectProvider>
    </div>
  );
};

export default ProjectsPage;
