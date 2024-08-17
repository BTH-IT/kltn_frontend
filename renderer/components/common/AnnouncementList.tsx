'use client';

import React from 'react';

import { IAnnouncement, ICourse } from '@/types';
import announcementService from '@/services/announcementService';

import AnnouncementItem from './AnnouncementItem';

const AnnouncementList = ({
  classes,
  announcements,
  setAnnouncements,
}: {
  classes: ICourse | null;
  announcements: IAnnouncement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<IAnnouncement[]>>;
}) => {
  const handlePin = async (announcement: IAnnouncement) => {
    try {
      const res = await announcementService.updateAnnouncement(announcement.classId, announcement.announcementId, {
        ...announcement,
        pin: new Date().toISOString(),
      });

      const newAnnouncements = announcements.filter((a) => a.announcementId !== res.data.announcementId);

      setAnnouncements([res.data, ...newAnnouncements]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await announcementService.deleteAnnouncement(classes?.classId ?? '', id);

      const newAnnouncements = announcements.filter((a) => a.announcementId !== id);

      setAnnouncements(newAnnouncements);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {announcements.map((announcement: IAnnouncement, idx: any) => (
        <AnnouncementItem
          key={idx}
          classes={classes}
          announcement={announcement}
          handlePin={handlePin}
          handleRemove={handleRemove}
          setAnnouncements={setAnnouncements}
        />
      ))}
    </div>
  );
};

export default AnnouncementList;
