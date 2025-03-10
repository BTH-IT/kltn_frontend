/* eslint-disable no-unused-vars */
'use client';

import { useState, useMemo } from 'react';
import { Gantt, StylingOption, Task, ViewMode } from 'gantt-task-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import 'gantt-task-react/dist/index.css';

import { IAssignment } from '@/types';
import { useGanttChartStyling } from '@/libs/hooks/useGanttChartStyling';

interface GanttChartProps {
  events?: IAssignment[];
}

export interface CustomTask extends Task {
  status: string;
  courseId: string;
  courseName: string;
  isHidden: boolean;
}

const getStatus = (assignment: IAssignment) => {
  const startDate = new Date(assignment.createdAt);
  const endDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const currentDate = new Date();

  const hasSubmission = !!assignment.submission;

  if (hasSubmission) return 'COMPLETED'; // Completed (Green)
  if (endDate && currentDate > endDate) return 'PENDING'; // Pending (Yellow)
  if (currentDate >= startDate && (!endDate || currentDate <= endDate)) return 'IN_PROGRESS'; // In Progress (Blue)
  if (currentDate < startDate) return 'NOT_STARTED'; // Not Started (Gray)

  return 'DELAYED';
};

const initTasks = (events: IAssignment[] = []): CustomTask[] => {
  return events.map((event, index) => {
    const startDate = new Date(event.createdAt);
    const endDate = event.dueDate ? new Date(event.dueDate) : new Date();

    return {
      id: event.assignmentId,
      courseId: event.courseId,
      courseName: event.course.name,
      name: event.title,
      start: startDate,
      end: endDate,
      type: 'task',
      progress: event.submission ? 100 : 0,
      status: getStatus(event),
      isHidden: !event.dueDate,
      displayOrder: index + 1,
      isDisabled: false,
      dependencies: [],
    };
  });
};

const TaskListHeader = () => {
  return (
    <table className="task-table">
      <thead>
        <tr>
          <td style={{ fontSize: '10px' }}>&nbsp;</td>
        </tr>
        <tr>
          <th className="table-header-cell event-name">
            <div className="header-content">
              <span>Bài tập</span>
            </div>
          </th>
          <th className="table-header-cell event-name">
            <div className="header-content">
              <span>Trạng thái</span>
            </div>
          </th>
        </tr>
      </thead>
    </table>
  );
};

const TaskListTable = ({ tasks }: { tasks: CustomTask[] }) => {
  return (
    <div>
      {tasks.map((task) => (
        <tr key={task.id} className="table-row">
          <td className={'table-cell-1'}>
            <div className="table-cell-flex">
              <p className="text-xs">
                {task.courseName} - {task.name}
              </p>
            </div>
          </td>
          <td className="table-cell-2">
            <div>
              <div className={`status ${task.status}`} />
              <p className={`status-text ${task.status}`}>
                {task.status === 'COMPLETED' ? 'Đã hoàn thành' : ''}
                {task.status === 'PENDING' ? 'Đang chờ' : ''}
                {task.status === 'IN_PROGRESS' ? 'Đang thực hiện' : ''}
                {task.status === 'NOT_STARTED' ? 'Chưa bắt đầu' : ''}
                {task.status === 'DELAYED' ? 'Quá hạn' : ''}
              </p>
            </div>
          </td>
        </tr>
      ))}
    </div>
  );
};

const stylingOptions: StylingOption = {
  listCellWidth: '200px',
  barCornerRadius: 8,
  TaskListHeader,
};

const GanttChart = ({ events }: GanttChartProps) => {
  const [view] = useState<ViewMode>(ViewMode.Day);
  const router = useRouter();

  const tasks = useMemo(() => initTasks(events), [events]);

  useGanttChartStyling(tasks, (task) => {
    toast.info(`Đang chuyển đến bài tập: ${task.name}`);
    router.push(`/courses/${task.courseId}/assignments/${task.id}`);
  });

  return (
    <div className="p-3">
      <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Dòng thời gian</h2>
      {tasks.length > 0 ? (
        <div className="gantt">
          <Gantt
            tasks={tasks}
            viewMode={view}
            columnWidth={30}
            rowHeight={32}
            {...stylingOptions}
            TaskListTable={(props) => <TaskListTable tasks={props.tasks as CustomTask[]} />}
          />
        </div>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '1rem' }}>Không có dữ liệu nào cả</p>
      )}
    </div>
  );
};

export { GanttChart };
