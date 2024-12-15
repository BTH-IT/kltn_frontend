/* eslint-disable no-unused-vars */
'use client';

import { Task } from 'gantt-task-react';
import { useEffect } from 'react';

const useGanttChartStyling = (tasks: Task[], onClick: (task: Task) => void) => {
  useEffect(() => {
    if (!tasks.length) return;

    const MILLISECONDS_IN_A_DAY = 86400000;
    const COLUMN_WIDTH = 30; // Define your COLUMN_WIDTH constant
    const ROW_HEIGHT = 40; // Define your ROW_HEIGHT constant
    const TASK_HEIGHT = 20; // Define your TASK_HEIGHT constant
    const HEADER_HEIGHT = 50; // Define your HEADER_HEIGHT constant

    const timeout = setTimeout(() => {
      // Get DOM elements
      const gridBody = document.querySelector('.gridBody');
      const todayRect = document.querySelector('.today rect');
      const container = document.querySelector('._CZjuD ._2B2zv');

      if (!gridBody || !todayRect || !container) return;

      const todayX = parseInt(todayRect.getAttribute('x') || '0', 10);

      // Clear existing task elements
      const existingTaskItems = container.querySelectorAll('.task-item');
      existingTaskItems.forEach((item) => item.remove());

      // Calculate Gantt chart start date
      const chartStartDate = new Date(
        Math.min(...tasks.map((task) => new Date(task.start).getTime())) - MILLISECONDS_IN_A_DAY,
      );

      // Render task bars
      tasks.forEach((task, index) => {
        if (task.type !== 'task') return;

        const taskStart = new Date(task.start).getTime();
        const taskEnd = new Date(task.end).getTime();
        const taskDuration = Math.round((taskEnd - taskStart) / MILLISECONDS_IN_A_DAY) + 1;

        const leftPosition = Math.round((taskStart - chartStartDate.getTime()) / MILLISECONDS_IN_A_DAY) * COLUMN_WIDTH;

        const taskWidth = taskDuration * COLUMN_WIDTH;

        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        taskDiv.style.cssText = `
          position: absolute;
          top: ${(index - 1) * ROW_HEIGHT + 3}px;
          left: ${leftPosition}px;
          width: ${taskWidth}px;
          height: ${TASK_HEIGHT}px;
          z-index: 1;
        `;
        taskDiv.textContent = task.name;
        taskDiv.onclick = () => onClick(task);

        container.appendChild(taskDiv);
      });

      // Render today line and dot
      const removeElements = (selector: string) => container.querySelectorAll(selector).forEach((el) => el.remove());
      removeElements('.today-line');
      removeElements('.today-dot');

      const createTodayMarker = (className: string, style: string) => {
        const div = document.createElement('div');
        div.className = className;
        div.style.cssText = style;
        container.appendChild(div);
      };

      createTodayMarker(
        'today-line',
        `
        position: absolute;
        left: ${todayX + COLUMN_WIDTH / 2}px;
        top: -5px;
        width: 1px;
        height: 100%;
        background-color: #7A8B93;
        z-index: 0;
      `,
      );

      createTodayMarker(
        'today-dot',
        `
        position: absolute;
        left: ${todayX + COLUMN_WIDTH / 2 - 2}px;
        top: -8px;
        width: 5px;
        height: 5px;
        border-radius: 100%;
        background-color: #7A8B93;
        z-index: 0;
      `,
      );

      // Update calendar header
      const calendarContainer = document.querySelector('._CZjuD');
      const svgElement = calendarContainer?.querySelector('svg');
      const svgRect = svgElement?.querySelector('rect');

      if (svgElement && svgRect) {
        svgElement.setAttribute('height', `${HEADER_HEIGHT}`);
        svgRect.setAttribute('height', `${HEADER_HEIGHT}`);
      }

      // Hide old text labels in SVG
      svgElement?.querySelectorAll('text._9w8d5').forEach((text) => {
        (text as HTMLElement).style.display = 'none';
      });

      // Create custom calendar labels
      const divContainer = document.createElement('div');
      divContainer.className = 'calendar-day';
      divContainer.style.cssText = `
        position: relative;
        height: ${HEADER_HEIGHT}px;
      `;
      calendarContainer?.insertBefore(divContainer, container);

      // Update grid columns
      const ticks = document.querySelector('.ticks');
      if (ticks) {
        const columnCount = ticks.children.length;
        const gridHeight = ticks.querySelector('line')?.getAttribute('y2');

        const gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gElement.setAttribute('class', 'columns');

        for (let i = 0; i < columnCount; i++) {
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', `${i * COLUMN_WIDTH}`);
          rect.setAttribute('y', '0');
          rect.setAttribute('width', `${COLUMN_WIDTH}`);
          rect.setAttribute('height', `${gridHeight}`);
          rect.setAttribute('fill', i % 7 < 5 ? '#fafafa' : '#f3f5f6');
          gElement.appendChild(rect);
        }

        gridBody.querySelector('.columns')?.remove(); // Remove old columns
        gridBody.appendChild(gElement);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [tasks, onClick]);
};

export { useGanttChartStyling };
