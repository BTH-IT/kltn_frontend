'use client';

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/common/Button';
import classService from '@/services/courseService';
import { CoursesContext } from '@/contexts/CoursesContext';

const InviteButton = ({ inviteCode }: { inviteCode: string }) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { setenrolledCourses, enrolledCourses } = useContext(CoursesContext);

  return (
    <Button
      buttonType="primary"
      onClick={async () => {
        try {
          setLoading(true);
          const res = await classService.addStudentToClassByInviteCode(inviteCode);

          if (res.data) {
            setLoading(false);

            setenrolledCourses([...enrolledCourses, res.data]);
            return router.replace(`/classes/${res.data.classId}`);
          }
        } catch (error) {
          console.error('Error adding student to class:', error);
        } finally {
          setLoading(false);
          router.replace('/');
        }
      }}
      className="flex gap-3 items-center"
      disabled={loading}
    >
      {loading && (
        <div className="mr-1 w-4 h-4 rounded-full border-t-2 border-b-2 animate-spin border-primaryGray"></div>
      )}
      Tham gia lớp học
    </Button>
  );
};

export default InviteButton;
