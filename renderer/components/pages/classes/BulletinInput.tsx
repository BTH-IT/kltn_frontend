'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { RefreshCw } from 'lucide-react';

import { IAnnouncement, ICourse } from '@/types';

import BulletForm from './BulletForm';

const BulletinInput = ({
  classes,
  setAnnouncements,
}: {
  classes: ICourse | null;
  setAnnouncements: React.Dispatch<React.SetStateAction<IAnnouncement[]>>;
}) => {
  const user = null;

  const [isPost, setIsPost] = useState(false);

  return (
    <div className="border rounded-md shadow">
      {!isPost ? (
        <div onClick={() => setIsPost((prev) => !prev)} className="flex items-center pr-4">
          <Image
            src={user?.imageUrl || '/images/avt.png'}
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
        <BulletForm setIsPost={setIsPost} classes={classes} setAnnouncements={setAnnouncements} />
      )}
    </div>
  );
};

export default BulletinInput;
