/* eslint-disable no-unused-vars */
declare global {
  interface Window {
    gantt: any;
  }
}

('use client');

import React, { useEffect } from 'react';
import 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

const Gantt = () => {
  useEffect(() => {
    window.gantt.init('gantt_here');
    window.gantt.parse({
      data: [
        {
          id: 1,
          text: 'Task #1',
          start_date: '2024-08-20',
          duration: 3,
          progress: 0.4,
        },
        {
          id: 2,
          text: 'Task #2',
          start_date: '2024-08-23',
          duration: 4,
          progress: 0.6,
        },
        // add more tasks here
      ],
    });
  }, []);

  return <div id="gantt_here" style={{ width: '100%', height: '100vh' }}></div>;
};

export default Gantt;
