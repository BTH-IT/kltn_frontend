'use client';

import React, { useEffect, useState } from 'react';

import { IAnnouncement, ICourse } from '@/types';

import BulletinInput from '../pages/classes/BulletinInput';

import AnnouncementList from './AnnouncementList';

const AnnouncementInput = ({ course }: { course: ICourse | null }) => {
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);

  useEffect(() => {
    setAnnouncements([]);
  }, [course]);

  return (
    <div className="flex flex-col gap-4">
      <BulletinInput classes={course} setAnnouncements={setAnnouncements} />
      <AnnouncementList announcements={announcements} setAnnouncements={setAnnouncements} classes={course} />
    </div>
  );
};

export default AnnouncementInput;
