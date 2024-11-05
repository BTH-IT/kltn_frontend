/* eslint-disable no-unused-vars */
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { IGroup } from '@/types/group';
import groupService from '@/services/groupService';
import { IUser } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';
import { Button } from '@/components/ui/button';
import userService from '@/services/userService';

interface CellJoinProps {
  data: IGroup;
}

export const CellJoin: React.FC<CellJoinProps> = ({ data }) => {
  const router = useRouter();

  const [user, setUser] = useState<IUser | null>(null);
  const [requestAvailable, setRequestAvailable] = useState(false);
  const [isThisGroup, setIsThisGroup] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, []);

  const isRequestAvailable = () => {
    const isHaveMember = data?.groupMembers?.length !== 0;

    return !isHaveMember;
  };

  useEffect(() => {
    const fetchUserRequest = async () => {
      const res = await userService.getAllRequests();

      if (res) {
        const isRequested = res.data.find((request) => request.groupId === data.groupId);

        if (isRequested) {
          setIsRequestSent(true);
        }
      }
    };
    fetchUserRequest();

    const isGroup = data.requests?.find((request) => request.groupId === data?.groupId);

    if (isGroup) {
      setIsThisGroup(true);
    }

    if (user) {
      const available = isRequestAvailable();
      setRequestAvailable(available);
    }

    setIsMounted(true);
  }, [data, user]);

  const sendRequest = async () => {
    try {
      const res = await groupService.makeRequest(data.groupId);

      if (res) {
        toast.success('Gửi yêu cầu tham gia thành công');
        setRequestAvailable(false);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  const cancelRequest = async () => {
    try {
      const request = data.requests?.find((request) => request.userId === user?.id);

      if (request) {
        const res = await groupService.removeRequest(request.requestId);

        if (res) {
          toast.success('Huỷ yêu cầu tham gia thành công');
          setRequestAvailable(true);
        }
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  console.log(requestAvailable, isRequestSent);
  // console.log(isThisGroup, data.groupName);

  return (
    <div className="flex items-center justify-center gap-3">
      {isMounted && (
        <>
          {requestAvailable || (!requestAvailable && !isThisGroup) ? (
            <Button disabled={!requestAvailable || isRequestSent} variant="primary" onClick={sendRequest}>
              Gửi yêu cầu tham gia
            </Button>
          ) : (
            <Button variant="destructive" onClick={cancelRequest}>
              Huỷ yêu cầu
            </Button>
          )}
        </>
      )}
    </div>
  );
};
