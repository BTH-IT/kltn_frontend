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
  const handlePin = async (announcement: IAnnouncement) => {
    try {
      const res = await announcementService.updateAnnouncement(announcement.courseId, announcement.announcementId, {
        ...announcement,
        isPinned: true,
      });

      const newAnnouncements = announcements.filter((a) => a.announcementId !== res.data.announcementId);

      setAnnouncements([res.data, ...newAnnouncements]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await announcementService.deleteAnnouncement(course?.classId ?? '', id);

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
          handlePin={handlePin}
          handleRemove={handleRemove}
          setAnnouncements={setAnnouncements}
        />
      ))}
    </div>
  );
};

export default AnnouncementList;
