'use client';

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/common/Button';
import courseService from '@/services/courseService';
import { CoursesContext } from '@/contexts/CoursesContext';

const InviteButton = ({ inviteCode }: { inviteCode: string }) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { setEnrolledCourses, enrolledCourses } = useContext(CoursesContext);

  return (
    <Button
      buttonType="primary"
      onClick={async () => {
        try {
          setLoading(true);
          const res = await courseService.addStudentToCourseByInviteCode(inviteCode);

          if (res.data) {
            setLoading(false);

            setEnrolledCourses([...enrolledCourses, res.data]);
            return router.replace(`/courses/${res.data.classId}`);
          }
        } catch (error) {
          console.error('Error adding student to class:', error);
        } finally {
          setLoading(false);
          router.replace('/');
        }
      }}
      className="flex items-center gap-3"
      disabled={loading}
    >
      {loading && (
        <div className="w-4 h-4 mr-1 border-t-2 border-b-2 rounded-full animate-spin border-primaryGray"></div>
      )}
      Tham gia lớp học
    </Button>
  );
};

export default InviteButton;
