'use client';

import { useState, useMemo } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

import { IAssignment } from '@/types';

interface GanttChartProps {
  events?: IAssignment[];
}

const initTasks = (events: IAssignment[] = []): Task[] => {
  return events
    .filter((event) => event.assignmentId && event.title) // Filter out invalid data
    .map((event) => {
      const startDate = event.createdAt ? new Date(event.createdAt) : new Date();
      const endDate = event.dueDate ? new Date(event.dueDate) : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Default to one week duration

      // Ensure valid date objects
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn('Invalid dates for task:', event);
        return null; // Skip invalid tasks
      }

      return {
        id: event.assignmentId,
        name: event.title,
        start: startDate,
        end: endDate,
        type: 'task',
        progress: event.submission ? 100 : 0, // Assuming submission indicates completion
        isDisabled: false,
        dependencies: [],
      } as Task;
    })
    .filter((task) => task !== null); // Remove null tasks
};

const GanttChart = ({ events }: GanttChartProps) => {
  const [view] = useState<ViewMode>(ViewMode.Day);

  // Safely memoize tasks
  const tasks = useMemo(() => initTasks(events), [events]);

  const handleClick = (task: Task) => {
    console.log('Task clicked:', task);
  };

  return (
    <div className="gantt-container">
      {tasks.length > 0 ? (
        <Gantt tasks={tasks} viewMode={view} onClick={handleClick} listCellWidth="200px" columnWidth={60} />
      ) : (
        <p>No tasks to display.</p>
      )}
    </div>
  );
};

export { GanttChart };
