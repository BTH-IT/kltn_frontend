/* eslint-disable no-unused-vars */
import { Clock, Users as TeamIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';
import { IGroup } from '@/types/group';
import UpcomingPlanning from '@/components/pages/groups/UpcomingPlanning';
import TeamMembers from '@/components/pages/groups/TeamMembers';

const GroupDetailPage = async ({ params }: { params: { courseId: string; groupId: string } }) => {
  const {
    payload: { data: group },
  } = await http.get<IGroup>(`${API_URL.GROUPS}/${params.groupId}`);

  return (
    <div className="mt-4 space-y-6">
      <Card className="text-white bg-gradient-to-r from-blue-500 to-purple-600">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">CNPM Nhóm 333</CardTitle>
          <CardDescription className="text-blue-100">Software Engineering Group Project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <TeamIcon className="w-5 h-5" />
              <span>Team Size: 10 members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Duration: 12 weeks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <UpcomingPlanning />

      <TeamMembers group={group} />
    </div>
  );
};

export default GroupDetailPage;
