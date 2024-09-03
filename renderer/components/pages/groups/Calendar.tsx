'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar: React.FC = () => {
  const events = [
    { title: 'Event 1', start: '2024-09-03', end: '2024-09-05' },
    { title: 'Event 2', start: '2024-09-10' },
    { title: 'Event 3', start: '2024-09-13', end: '2024-09-15' },
  ];

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        dateClick={(info: { dateStr: string }) => alert('Date: ' + info.dateStr)}
      />
    </div>
  );
};

export default Calendar;
