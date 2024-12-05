'use client';

import React from 'react';

import { IAnnouncement, ICourse } from '@/types';
import announcementService from '@/services/announcementService';

import AnnouncementItem from './AnnouncementItem';

const AnnouncementList = ({
  course,
  announcements,
  setAnnouncements,
}: {
  course: ICourse | null;
  announcements: IAnnouncement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<IAnnouncement[]>>;
}) => {
  const handleRemove = async (id: string) => {
    try {
      await announcementService.deleteAnnouncement(course?.courseId ?? '', id);

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
          course={course}
          announcement={announcement}
          handleRemove={handleRemove}
          setAnnouncements={setAnnouncements}
        />
      ))}
    </div>
  );
};

export default AnnouncementList;
