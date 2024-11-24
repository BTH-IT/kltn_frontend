'use client';
import { Crown, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import CreateGroupMemberModal from '@/components/modals/CreateGroupMemberModal';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';
import groupService from '@/services/groupService';
import { IGroup, IGroupMember, IUser } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';

const TeamMembers = ({ group }: { group: IGroup }) => {
  const router = useRouter();

  const sortedGroupMembers = group?.groupMembers?.sort((a) => (a.isLeader ? -1 : 1));
  const [members, setMembers] = useState<IGroupMember[]>(sortedGroupMembers || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  const { setItems } = useContext(BreadcrumbContext);

  useEffect(() => {
    if (!group.course) return;

    const breadcrumbLabel1 = group.course.name;
    const breadcrumbLabel2 = group.groupName;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel1, href: `/courses/${group.course.courseId}` },
      {
        label: 'Đồ án / Tiểu luận',
        href: `/courses/${group.course.courseId}/projects`,
      },
      { label: breadcrumbLabel2 },
    ]);
  }, [group, setItems]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null');
    console.log(group);

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, []);

  const removeMember = async (member: IGroupMember) => {
    try {
      if (member.isLeader) {
        toast.error('Không thể xóa nhóm trưởng');
        return;
      }
      const data = {
        studentIds: [member.studentId],
      };
      await groupService.deleteMember(group.groupId, data);
      setMembers(members.filter((m) => m.studentId !== member.studentId));
      toast.success('Xóa thành viên thành công');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const setLeader = async (studentId: string) => {
    const data = {
      studentId,
    };
    const res = await groupService.setLeader(group.groupId, data);
    console.log(res);
    toast.success('Đặt trưởng nhóm thành công');
    setMembers(
      members
        .map((member) =>
          member.studentId === studentId ? { ...member, isLeader: !member.isLeader } : { ...member, isLeader: false },
        )
        .sort((a) => (a.isLeader ? -1 : 1)),
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Thành viên nhóm</CardTitle>
            {(user?.id === group?.course?.lecturerId ||
              group.groupMembers?.some((member) => member.isLeader && member.studentId === user?.id)) && (
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Thêm thành viên
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.studentId}
                  className="flex items-center justify-between p-4 space-x-4 rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={member?.studentObj?.avatar || '/images/avt.png'}
                        alt={member?.studentObj?.userName || member?.studentObj?.fullName}
                      />
                    </Avatar>
                    <div>
                      <div className="font-medium">{member?.studentObj?.userName || member?.studentObj?.fullName}</div>
                      {/* <div className="text-sm text-gray-500">{member.studentObj.role}</div> */}
                    </div>
                    {member.isLeader && (
                      <Badge variant="secondary" className="text-red-500">
                        <Crown className="w-3 h-3 mr-1" />
                        Trưởng nhóm
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {user?.id === group?.course?.lecturerId || (member.isLeader && user?.id === member.studentId) ? (
                      <>
                        {!member.isLeader && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => setLeader(member.studentId)}>
                              Đặt làm trưởng nhóm
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => removeMember(member)}>
                              <X className="w-4 h-4" />
                              <span className="sr-only">Xóa</span>
                            </Button>
                          </>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <CreateGroupMemberModal isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} group={group} setMembers={setMembers} />
    </>
  );
};

export default TeamMembers;
