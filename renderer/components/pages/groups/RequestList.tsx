'use client';

import { AxiosError } from 'axios';
import { Check, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CourseContext } from '@/contexts/CourseContext';
import groupService from '@/services/groupService';
import { IGroup, IRequest, IUser } from '@/types';
import { formatVNDate, KEY_LOCALSTORAGE } from '@/utils';

const RequestList = ({ group }: { group: IGroup }) => {
  const router = useRouter();

  const { course } = useContext(CourseContext);
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (group.requests && group.requests.length > 0) {
      setRequests(group.requests);
    }
  }, [group.requests]);

  const aceptRequest = async (requestId: string) => {
    try {
      const res = await groupService.aceptRequest(requestId);
      if (res) {
        toast.success('Đã chấp nhận yêu cầu');
        router.refresh();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  const removeRequest = async (requestId: string) => {
    try {
      const res = await groupService.removeRequest(requestId);
      if (res) {
        toast.success('Đã từ chối yêu cầu');
        setRequests(requests.filter((r) => r.requestId !== requestId));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  return (
    <>
      {user &&
        course &&
        (course.lecturerId === user.id ||
          group.groupMembers?.some((member) => member.isLeader && member.studentId === user.id)) && (
          <Card className="w-full mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Yêu cầu tham gia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto min-h-[100px]">
                {requests.length > 0 && (
                  <ScrollArea>
                    <Table className="text-md">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Người yêu cầu</TableHead>
                          <TableHead>Thời gian yêu cầu</TableHead>
                          <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request) => (
                          <TableRow key={request.requestId}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Image
                                  src={request.user?.avatar || '/images/avt.png'}
                                  height={3000}
                                  width={3000}
                                  alt="avatar"
                                  className="w-[35px] h-[35px] rounded-full"
                                />
                                <div>
                                  <p className="font-medium">{request.user?.fullName || request.user?.userName}</p>
                                  <p className="text-sm text-muted-foreground">{request.user?.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{formatVNDate(request.createdAt)}</TableCell>
                            {(user.id === group.course?.lecturerId ||
                              user.id === group.groupMembers?.find((m) => m.isLeader === true)?.studentId) && (
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    onClick={() => aceptRequest(request.requestId)}
                                    size="icon"
                                    variant="outline"
                                    className="w-8 h-8"
                                  >
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span className="sr-only">Approve</span>
                                  </Button>
                                  <Button
                                    onClick={() => removeRequest(request.requestId)}
                                    size="icon"
                                    variant="outline"
                                    className="w-8 h-8"
                                  >
                                    <X className="w-4 h-4 text-red-500" />
                                    <span className="sr-only">Reject</span>
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </div>
            </CardContent>
          </Card>
        )}
    </>
  );
};

export default RequestList;
