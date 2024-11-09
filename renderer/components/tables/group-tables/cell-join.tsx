/* eslint-disable no-unused-vars */
'use client';

import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import groupService from '@/services/groupService';
import userService from '@/services/userService';
import { IUser } from '@/types';
import { IGroup, IRequest } from '@/types/group';
import { KEY_LOCALSTORAGE } from '@/utils';
interface CellJoinProps {
  data: IGroup;
}

export const CellJoin: React.FC<CellJoinProps> = ({ data }) => {
  const router = useRouter();

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
              request.group?.groupType == data.groupType,
          );

          setHasRequest(userRequestForGroup);

          const otherGroupRequest = userRequests.some(
            (request) =>
              request.groupId !== data.groupId &&
              request.userId === user?.id &&
              request.group?.groupType == data.groupType,
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
        router.refresh();
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
      const request = allRequests.find((request) => request.userId === user?.id && request.groupId === data.groupId);
      if (request) {
        const res = await groupService.removeRequest(request.requestId);
        if (res) {
          toast.success('Huỷ yêu cầu tham gia thành công');
          router.refresh();
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
      {hasLeader ? null : (
        <>
          {hasRequest ? (
            <Button variant="destructive" onClick={cancelRequest}>
              Huỷ yêu cầu
            </Button>
          ) : (
            !isRequestSent &&
            !groupHasRequest &&
            !userHasRequestOther && (
              <Button variant="primary" onClick={sendRequest}>
                Yêu cầu tham gia
              </Button>
            )
          )}
        </>
      )}
    </div>
  );
};
