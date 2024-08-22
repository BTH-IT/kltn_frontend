'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { RefreshCw } from 'lucide-react';

import { IAnnouncement, ICourse, IUser } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';

import BulletForm from './BulletForm';

const BulletinInput = ({
  course,
  setAnnouncements,
}: {
  course: ICourse | null;
  setAnnouncements: React.Dispatch<React.SetStateAction<IAnnouncement[]>>;
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isPost, setIsPost] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}') as IUser;
    setUser(user);
  }, []);

  return (
    <div className="border rounded-md shadow">
      {!isPost ? (
        <div onClick={() => setIsPost((prev) => !prev)} className="flex items-center pr-4">
          <Image
            src={user?.avatar || '/images/avt.png'}
            height={75}
            width={75}
            alt="avatar"
            className="p-4 w-[75px] h-[75px] rounded-full"
          />
          <div className="flex items-center justify-between flex-1 gap-3">
            <p className="text-sm">Thông báo nội dung nào đó cho lớp học của bạn</p>
            <RefreshCw />
          </div>
        </div>
      ) : (
        <BulletForm setIsPost={setIsPost} course={course} setAnnouncements={setAnnouncements} />
      )}
    </div>
  );
};

export default BulletinInput;
