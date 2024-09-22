/* eslint-disable no-unused-vars */
import { Mail, MapPin, Clock, Users as TeamIcon } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';
import { IGroup } from '@/types/group';
import UpcomingPlanning from '@/components/pages/groups/UpcomingPlanning';

const GroupDetailPage = async ({ params }: { params: { courseId: string; groupId: string } }) => {
  const {
    payload: { data: group },
  } = await http.get<IGroup>(`${API_URL.GROUPS}/${params.groupId}`);

  return (
    <div className="mt-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>CNPM Nhóm 333 - Software Engineering Group Project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <TeamIcon className="w-5 h-5 text-gray-500" />
              <span>Team Size: 5 members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span>Duration: 12 weeks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <UpcomingPlanning />

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {['John Doe', 'Jane Smith', 'Alex Johnson', 'Emily Brown', 'Chris Lee'].map((member, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback>
                    {member
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <span>{member}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupDetailPage;
