'use client';

import { useContext } from 'react';

import { AttendanceClient } from '@/components/tables/attendance-tables/client';
import { CourseContext } from '@/contexts/CourseContext';

const AttendancePage = () => {
  const { course } = useContext(CourseContext);

  return (
    <div>
      <h1>Attendance</h1>
      <AttendanceClient data={course?.students || []} />
    </div>
  );
};

export default AttendancePage;
