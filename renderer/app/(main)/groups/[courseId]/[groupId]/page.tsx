/* eslint-disable no-unused-vars */
import { Users as TeamIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';
import { IGroup } from '@/types/group';
import TeamMembers from '@/components/pages/groups/TeamMembers';
import RequestList from '@/components/pages/groups/RequestList';
import { BackButtonV2 } from '@/components/common/BackButtonV2';
import { getUserFromCookie } from '@/libs/actions';

const GroupDetailPage = async ({ params }: { params: { courseId: string; groupId: string } }) => {
  const [user, data] = await Promise.all([
    getUserFromCookie(),
    http.get<IGroup>(`${API_URL.GROUPS}/${params.groupId}`) as Promise<any>,
  ]);

  const group = data.payload?.data;

  if (!user) {
    return redirect('/login');
  }

  if (!group) {
    return redirect('/');
  }

  return (
    <div className="mt-4 space-y-6">
      <Card className="text-white bg-gradient-to-r from-blue-500 to-purple-600">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-3xl font-bold">
            <span>{group.groupName}</span>
            {user.id === group.course?.lecturerId && <BackButtonV2 url={`/courses/${group?.courseId}/projects`} />}
          </CardTitle>
          <CardDescription className="text-blue-100">
            Môn học: {group.course?.subject?.name} - Nhóm: {group.course?.courseGroup}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-2">
              <TeamIcon className="w-5 h-5" />
              <span>Số lượng thành viên tối đa: {group.numberOfMembers} Nguời</span>
            </div>
            <div className="flex items-center space-x-2">
              <TeamIcon className="w-5 h-5" />
              <span>Đồ án: {group.project?.title || 'Chưa được giao'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <TeamMembers group={group} />

      <RequestList group={group} />
    </div>
  );
};

export default GroupDetailPage;
