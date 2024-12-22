'use client';

import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { IAnnouncement, ICourse } from '@/types';
import announcementService from '@/services/announcementService';
import { logError } from '@/libs/utils';

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
  const [list, setList] = React.useState<IAnnouncement[]>([]);
  const handleRemove = async (id: string) => {
    try {
      await announcementService.deleteAnnouncement(course?.courseId ?? '', id);

      const newAnnouncements = announcements.filter((a) => a.announcementId !== id);

      setAnnouncements(newAnnouncements);
      toast.success('Xóa thông báo thành công!');
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    setList([
      ...(course?.assignments ?? []).map((a) => {
        return {
          ...announcements[0],
          type: 'assignment',
          title: `${course?.lecturer?.fullName} đã tạo một bài tập mới: ${a.title}`,
          url: `/courses/${course?.courseId}/assignments/${a.assignmentId}`,
          createdAt: a.createdAt as string,
          updatedAt: a.updatedAt as string,
        };
      }),
      ...announcements,
    ]);
  }, [announcements, course]);

  const sortedList = list.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="flex flex-col gap-3">
      {sortedList.map((announcement: IAnnouncement, idx: any) => (
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
