'use client';

import React, { useEffect, useState } from 'react';

import { IAnnouncement, ICourse } from '@/types';

import BulletinInput from '../pages/courses/BulletinInput';

import AnnouncementList from './AnnouncementList';

const AnnouncementInput = ({ course }: { course: ICourse | null }) => {
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);

  useEffect(() => {
    setAnnouncements(course?.announcements || []);
  }, [course]);

  return (
    <div className="flex flex-col gap-4">
      {!course?.saveAt && <BulletinInput course={course} setAnnouncements={setAnnouncements} />}
      <AnnouncementList announcements={announcements} setAnnouncements={setAnnouncements} course={course} />
    </div>
  );
};

export default AnnouncementInput;
