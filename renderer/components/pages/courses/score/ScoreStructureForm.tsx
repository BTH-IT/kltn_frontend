/* eslint-disable no-unused-vars */
'use client';

import React, { FormEvent, useContext, useState } from 'react';

import { Button } from '@/components/ui/button';
import courseService from '@/services/courseService';
import { CourseContext } from '@/contexts/CourseContext';
import { ScoreStructureContext } from '@/contexts/ScoreStructureContext';

import ScoreStructureAccordion from './ScoreStructureAccordion';

const ScoreStructureForm = () => {
  const { scoreStructures } = useContext(ScoreStructureContext);
  const { course, setCourse } = useContext(CourseContext);
  const [error, setError] = useState<string | null>(null);

  const validatePercentages = () => {
    for (const parent of scoreStructures.filter((item) => item.divideColumnFirst && item.divideColumnSecond)) {
      const children = scoreStructures.filter((item) => item.parentId === parent.id);
      const totalPercent = children.reduce((acc, item) => acc + item.percent, 0);

      if (totalPercent !== parent.percent) {
        const errorMessage =
          totalPercent > parent.percent
            ? `Tổng phần trăm của các mục con đang là: ${totalPercent} đã vượt quá phần trăm của mục cha (${parent.percent}%).`
            : `Tổng phần trăm của các mục con đang là: ${totalPercent} đang không khớp với phần trăm của mục cha (${parent.percent}%).`;

        return errorMessage;
      }
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validatePercentages();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!course) return;

    try {
      const res = await courseService.updateCourse(course.courseId, {
        scoreStructures: scoreStructures,
      });
      setCourse(res.data);
    } catch (error) {
      setError('Cập nhật lớp học thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mt-32 font-semibold text-center">CẤU TRÚC ĐIỂM</h2>
      {scoreStructures
        .filter((item) => !item.parentId)
        .map((scoreStructure, index) => (
          <ScoreStructureAccordion index={`${index + 1}`} scoreStructure={scoreStructure} key={scoreStructure.id} />
        ))}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="flex items-center justify-center my-5">
        <Button variant="primary">Lưu cấu trúc điểm</Button>
      </div>
    </form>
  );
};

export default ScoreStructureForm;
