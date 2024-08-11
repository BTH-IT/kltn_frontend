'use client';

import { useContext } from 'react';

import { AttendanceClient } from '@/components/tables/attendance-tables/client';
import { ClassContext } from '@/contexts/ClassContext';

const AttendancePage = () => {
  const { classes } = useContext(ClassContext);

  return (
    <div>
      <h1>Attendance</h1>
      <AttendanceClient data={classes?.students || []} />
    </div>
  );
};

export default AttendancePage;
