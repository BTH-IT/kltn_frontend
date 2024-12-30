/* eslint-disable no-unused-vars */
'use client';

import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import groupService from '@/services/groupService';
import userService from '@/services/userService';
import { IUser } from '@/types';
import { IGroup, IRequest } from '@/types/group';
import { KEY_LOCALSTORAGE } from '@/utils';
import { CourseContext } from '@/contexts/CourseContext';
import { AssignmentContext } from '@/contexts/AssignmentContext';
interface CellJoinProps {
  data: IGroup;
}

export const CellJoin: React.FC<CellJoinProps> = ({ data }) => {
  const router = useRouter();
  const { course } = useContext(CourseContext);
  const { assignment } = useContext(AssignmentContext);

  const [user, setUser] = useState<IUser | null>(null);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [hasRequest, setHasRequest] = useState(false);
  const [userHasRequestOther, setUserHasRequestOther] = useState(false);
  const [groupHasRequest, setGroupHasRequest] = useState(false);
  const [allRequests, setAllRequests] = useState<IRequest[]>([]);

  // Memoize `groupMembers` leader check to optimize re-renders
  const hasLeader = useMemo(() => data?.groupMembers?.some((member) => member.isLeader), [data]);

  // Fetch user data from localStorage and redirect to login if not available
  useEffect(() => {
    const storedUser = localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  // Fetch all requests made by the user and set request-related states
  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const res = await userService.getAllRequests();
        if (res) {
          const userRequests = res.data || [];
          const userRequestForGroup = userRequests.some(
            (request) =>
              request.groupId === data.groupId &&
              request.userId === user?.id &&
              request.group?.groupType == data.groupType &&
              course?.courseId === request.group?.courseId &&
              request.group?.assignmentId == assignment?.assignmentId,
          );

          setHasRequest(userRequestForGroup);

          const otherGroupRequest = userRequests.some(
            (request) =>
              request.groupId !== data.groupId &&
              request.userId === user?.id &&
              request.group?.groupType == data.groupType &&
              course?.courseId === request.group?.courseId &&
              request.group?.assignmentId == assignment?.assignmentId,
          );
          setUserHasRequestOther(otherGroupRequest);

          setGroupHasRequest((data?.requests?.length ?? 0) > 0);

          setAllRequests(userRequests);
        }
      } catch (error) {
        console.error('Error fetching user requests:', error);
      }
    };

    if (user) fetchUserRequests();
  }, [data, user]);

  // Send a join request
  const sendRequest = async () => {
    try {
      const res = await groupService.makeRequest(data.groupId);
      if (res) {
        toast.success('Gửi yêu cầu tham gia thành công');
        setIsRequestSent(true);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  // Cancel the join request
  const cancelRequest = async () => {
    try {
      const request = allRequests.find(
        (request) =>
          request.groupId === data.groupId &&
          request.userId === user?.id &&
          request.group?.groupType == data.groupType &&
          course?.courseId === request.group?.courseId &&
          request.group?.assignmentId == assignment?.assignmentId,
      );
      if (request) {
        const res = await groupService.removeRequest(request.requestId);
        if (res) {
          toast.success('Huỷ yêu cầu tham gia thành công');
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error canceling join request:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {hasLeader ? (
        <>Nhóm đã có trưởng nhóm vui lòng liên hệ họ hoặc giảng viên để tham gia</>
      ) : (
        <>
          {hasRequest ? (
            <Button variant="destructive" onClick={cancelRequest}>
              Huỷ yêu cầu
            </Button>
          ) : !isRequestSent && !groupHasRequest && !userHasRequestOther ? (
            <Button variant="primary" onClick={sendRequest}>
              Yêu cầu tham gia
            </Button>
          ) : (
            <>Nhóm này đã có người gửi yêu cầu hoặc bạn đã gửi yêu cầu cho nhóm khác</>
          )}
        </>
      )}
    </div>
  );
};
