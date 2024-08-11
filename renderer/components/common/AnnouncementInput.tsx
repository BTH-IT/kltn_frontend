'use client';

import React, { useEffect, useState } from 'react';

import { IAnnouncement, IClasses } from '@/types';

import BulletinInput from '../pages/classes/BulletinInput';

import AnnouncementList from './AnnouncementList';

const AnnouncementInput = ({ classes }: { classes: IClasses | null }) => {
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);

  useEffect(() => {
    setAnnouncements(classes?.announcements || []);
  }, [classes]);

  return (
    <div className="flex flex-col gap-4">
      <BulletinInput classes={classes} setAnnouncements={setAnnouncements} />
      <AnnouncementList announcements={announcements} setAnnouncements={setAnnouncements} classes={classes} />
    </div>
  );
};

export default AnnouncementInput;
