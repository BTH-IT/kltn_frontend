/* eslint-disable no-unused-vars */
'use client';

import { useEffect } from 'react';

import { CustomTask } from '@/components/common/GanttChart';

const MILLISECONDS_IN_A_DAY = 86400000;
const COLUMN_WIDTH = 30;
const ROW_HEIGHT = 40;
const TASK_HEIGHT = 20;
const HEADER_HEIGHT = 50;

const useGanttChartStyling = (tasks: CustomTask[], onClick: (task: CustomTask) => void) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const gridBody = document.querySelector('.gridBody');
      const todayRect = document.querySelector('.today rect');
      const todayX = parseInt(todayRect?.getAttribute('x') || '0', 10);
      const container = document.querySelector('._CZjuD ._2B2zv');

      const taskItems = container?.querySelectorAll('.task-item');
      taskItems?.forEach((item) => container?.removeChild(item));

      const chartStartDate = new Date(Math.min(...tasks.map((task) => task.start.getTime())) - MILLISECONDS_IN_A_DAY);

      tasks.forEach((task) => {
        if (task.type === 'task') {
          const taskDuration = Math.round((task.end.getTime() - task.start.getTime()) / MILLISECONDS_IN_A_DAY) + 1;

          const leftPosition =
            Math.round((task.start.getTime() - chartStartDate.getTime()) / MILLISECONDS_IN_A_DAY) * COLUMN_WIDTH;

          const taskWidth = taskDuration * COLUMN_WIDTH;
          const taskDiv = document.createElement('div');
          taskDiv.style.position = 'absolute';
          taskDiv.style.top = `${(task.displayOrder! - 1) * ROW_HEIGHT + 3}px`;
          taskDiv.style.left = `${leftPosition}px`;
          taskDiv.style.width = `${taskWidth}px`;
          taskDiv.style.height = `${TASK_HEIGHT}px`;
          taskDiv.style.zIndex = '1';
          taskDiv.textContent = task.name;
          taskDiv.classList.add('task-item', `task-${task.status}`);
          taskDiv.onclick = () => {
            onClick(task);
          };
          container?.appendChild(taskDiv);
        }
      });

      const todayLine = container?.querySelectorAll('.today-line');
      todayLine?.forEach((element) => element.remove());
      const todayDot = container?.querySelectorAll('.today-dot');
      todayDot?.forEach((element) => element.remove());

      const rectDiv = document.createElement('div');
      rectDiv.className = 'today-line';
      rectDiv.style.position = 'absolute';
      rectDiv.style.left = `${todayX + COLUMN_WIDTH / 2}px`;
      rectDiv.style.top = '-5px';
      rectDiv.style.width = '1px';
      rectDiv.style.height = '100%';
      rectDiv.style.backgroundColor = '#7A8B93';
      rectDiv.style.zIndex = '0';

      const circleDiv = document.createElement('div');
      circleDiv.className = 'today-dot';
      circleDiv.style.position = 'absolute';
      circleDiv.style.left = `${todayX + COLUMN_WIDTH / 2 - 2}px`;
      circleDiv.style.top = '-8px';
      circleDiv.style.width = '5px';
      circleDiv.style.height = '5px';
      circleDiv.style.borderRadius = '100%';
      circleDiv.style.backgroundColor = '#7A8B93';
      circleDiv.style.zIndex = '0';

      container?.appendChild(rectDiv);
      container?.appendChild(circleDiv);

      const containerCalendar = document.querySelector('._CZjuD');

      const svgElement = containerCalendar?.querySelector('svg');
      const svgRectElement = svgElement?.querySelector('rect');
      svgElement?.setAttribute('height', `${HEADER_HEIGHT}px`);
      svgRectElement?.setAttribute('height', `${HEADER_HEIGHT}px`);

      if (svgElement) {
        svgElement.remove();

        const calendarDays = containerCalendar?.querySelectorAll('.calendar-day');
        calendarDays?.forEach((element) => element.remove());

        const divElementContainer = document.createElement('div');
        divElementContainer.className = 'calendar-day';
        divElementContainer.style.position = 'relative';
        divElementContainer.style.height = `${HEADER_HEIGHT}px`;

        divElementContainer.appendChild(svgElement);

        containerCalendar?.insertBefore(divElementContainer, container);

        const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const textElements = svgElement.querySelectorAll('text._9w8d5');
        const current = new Date();
        const minStartDate = new Date(Math.min(...tasks.map((task) => task.start.getTime())) - MILLISECONDS_IN_A_DAY);
        const maxEndDate = new Date(Math.max(...tasks.map((task) => task.end.getTime())) + MILLISECONDS_IN_A_DAY);
        const totalDays = Math.ceil((maxEndDate.getTime() - minStartDate.getTime()) / MILLISECONDS_IN_A_DAY);
        let currentMonth = minStartDate.getMonth();
        let currentYear = minStartDate.getFullYear();

        for (let i = 0; i < totalDays; i++) {
          const currentDate = new Date(minStartDate.getTime() + i * MILLISECONDS_IN_A_DAY);

          if (currentDate.getDate() === 1 || i === 0) {
            let currentMonthAbbreviation = monthAbbreviations[currentMonth];

            const monthDiv = document.createElement('div');
            monthDiv.className = 'month-label';
            monthDiv.style.position = 'absolute';
            monthDiv.style.left = `${i * COLUMN_WIDTH + 6}px`;
            monthDiv.style.top = '12px';
            monthDiv.style.fontSize = '12px';
            monthDiv.style.fontWeight = '500';
            monthDiv.style.lineHeight = '15.6px';
            monthDiv.style.color = '#1E1E1E';
            monthDiv.textContent = `${currentMonthAbbreviation} ${
              currentYear !== new Date().getFullYear() ? currentYear : ''
            }`;

            divElementContainer?.appendChild(monthDiv);

            if (currentMonth < 11) {
              currentMonth++;
            } else {
              currentMonth = 0;
              currentYear++;
            }
          }
        }

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const currentDayText = `${daysOfWeek[current.getDay()]}, ${current.getDate()}`;

        textElements.forEach((textElement) => {
          const x = textElement.getAttribute('x');
          const y = textElement.getAttribute('y');

          const dateText = textElement.textContent?.trim();

          if (x && y && dateText) {
            const divElement = document.createElement('div');

            divElement.style.position = 'absolute';
            divElement.style.left = `${x}px`;
            divElement.style.top = `${parseInt(y) - 5}px`;

            divElement.style.fontSize = '12px';
            divElement.style.fontWeight = '400';
            divElement.style.lineHeight = '18px';
            divElement.style.color = '#1E1E1E';

            divElement.textContent = dateText.split(',')[1]?.trim();

            divElementContainer?.appendChild(divElement);

            if (dateText === currentDayText) {
              divElement.style.width = '30px';
              divElement.style.height = '18px';
              divElement.style.display = 'flex';
              divElement.style.borderRadius = '2px';
              divElement.style.backgroundColor = '#E0E7EB';
              divElement.style.justifyContent = 'center';
              divElement.style.alignItems = 'center';
              divElement.style.left = `${parseInt(x) - 15}px`;
            }
          }
        });

        textElements.forEach((textElement) => {
          // @ts-ignore
          textElement.style.display = 'none';
        });
      }

      const rowsElement = gridBody?.querySelector('.rows');
      const ticks = document.querySelector('.ticks');
      const elements = document.querySelectorAll('._1eT-t');
      elements.forEach((element) => {
        element.remove();
      });

      let columnLenght = 0;
      let height;
      const fillColor1 = '#fafafa';
      const fillColor2 = '#f3f5f6';

      if (ticks) {
        columnLenght = ticks.children.length;
        height = ticks.querySelector('line')?.getAttribute('y2');
      }

      if (gridBody) {
        const oldColumns = gridBody.querySelectorAll('.columns');
        oldColumns.forEach((column) => column.remove());

        const gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        gElement.setAttribute('class', 'columns');

        for (let i = 0; i < columnLenght; i++) {
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', `${i * COLUMN_WIDTH}`);
          rect.setAttribute('y', '0');
          rect.setAttribute('width', `${COLUMN_WIDTH}`);
          rect.setAttribute('height', `${height}`);

          const dayOfWeek = i % 7;

          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            rect.setAttribute('fill', fillColor1);
          } else {
            rect.setAttribute('fill', fillColor2);
          }

          gElement.appendChild(rect);
        }

        if (rowsElement && gridBody.contains(rowsElement)) {
          const referenceNode = rowsElement.nextSibling || null;
          gridBody.insertBefore(gElement, referenceNode);
        } else {
          console.warn('rowsElement not found or invalid. Appending columns to gridBody.');
          gridBody.appendChild(gElement);
        }
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [tasks]);
};

export { useGanttChartStyling };
