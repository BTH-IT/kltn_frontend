'use client';

import React, { useEffect } from 'react';

import { GanttChart } from '@/components/common/GanttChart';
import { IAssignment } from '@/types';
import assignmentService from '@/services/assignmentService';
import { logError } from '@/libs/utils';

const SchedulePage = () => {
  const [events, setEvents] = React.useState<IAssignment[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await assignmentService.getAssignmentsByUser();

        setEvents(res.data);
      } catch (error) {
        logError(error);
      }
    };

    fetchEvents();
  }, []);

  return <GanttChart events={events} />;
};

export default SchedulePage;
