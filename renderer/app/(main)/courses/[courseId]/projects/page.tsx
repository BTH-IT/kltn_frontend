import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Users } from 'lucide-react';

import { IProject } from '@/types/project';
import http from '@/libs/http';
import { API_URL } from '@/constants/endpoints';
import { ProjectClient } from '@/components/tables/project-tables/client';
import { CreateProjectProvider } from '@/contexts/CreateProjectContext';
import { ICourse, IGroup } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';
import { GroupContextProvider } from '@/contexts/GroupContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TeamMembers from '@/components/pages/groups/TeamMembers';
import RequestList from '@/components/pages/groups/RequestList';
import StudentGroup from '@/components/common/StudentGroup';
import { BackButtonV3 } from '@/components/common/BackButtonV3';

const ProjectsPage = async ({ params }: { params: { courseId: string } }) => {
  const {
    payload: { data: course },
  } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`);

  if (!course) {
    return redirect('/');
  }

  if (!course.setting.hasFinalScore) {
    return redirect(`/courses/${params.courseId}`);
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

  const group = groups.find((group) => group?.groupMembers?.some((member) => member.studentId === user.id));

  return (
    <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
      <CreateProjectProvider projects={projects}>
        <GroupContextProvider groups={groups}>
          {user.id === course.lecturerId ? (
            <ProjectClient user={user} />
          ) : group ? (
            <div className="mt-4 space-y-6">
              <Card className="text-white bg-gradient-to-r from-blue-500 to-purple-600">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-3xl font-bold">
                    <span>{group.groupName}</span>
                    <div className="flex items-center gap-2">
                      <BackButtonV3
                        url={`/groups/${group?.courseId}/${group?.groupId}/submit`}
                        icon="Captions"
                        tooltipText="Nộp đồ án/tiểu luận"
                      />
                      <BackButtonV3
                        url={`/groups/${group?.courseId}/${group?.groupId}/reports`}
                        icon="NotebookPen"
                        iconSize={7}
                        tooltipText="Báo cáo tiến độ"
                      />
                    </div>
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Môn học: {group?.course?.subject?.name} - Nhóm: {group?.course?.courseGroup}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Số lượng thành viên tối đa: {group?.numberOfMembers} Nguời</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Đồ án: {group.project?.title || 'Chưa được giao'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <TeamMembers group={group} />

              <RequestList group={group} />
            </div>
          ) : (
            <StudentGroup group={group || null} groups={groups} />
          )}
        </GroupContextProvider>
      </CreateProjectProvider>
    </div>
  );
};

export default ProjectsPage;
