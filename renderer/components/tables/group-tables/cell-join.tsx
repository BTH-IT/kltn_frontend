/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { IGroup } from '@/types/group';
import groupService from '@/services/groupService';
import { IUser } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';
import { Button } from '@/components/ui/button';

interface CellJoinProps {
  data: IGroup;
}

export const CellJoin: React.FC<CellJoinProps> = ({ data }) => {
  const router = useRouter();

  const [user, setUser] = useState<IUser | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, []);

  const sendRequest = async () => {
    try {
      const res = await groupService.makeRequest(data.groupId);

      if (res) {
        toast.success('Gửi yêu cầu tham gia thành công');
        setRequestSent(true);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  const isRequestAvailable = () => {
    const isMember = data.groupMembers?.find((member) => member.studentId === user?.id);
    const isRequestSent = data.requests?.find((request) => request.user?.id === user?.id);
    const isGroupFull = data.groupMembers?.length === data.numberOfMembers;
    console.log(isMember, isRequestSent, isGroupFull);

    return !isMember && !isRequestSent && !isGroupFull;
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <Button disabled={!isRequestAvailable() || requestSent} variant="primary" onClick={sendRequest}>
        Gửi yêu cầu tham gia
      </Button>
    </div>
  );
};
