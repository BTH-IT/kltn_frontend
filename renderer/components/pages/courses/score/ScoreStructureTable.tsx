'use client';
import React, { useContext } from 'react';

import { ScoreStructureContext } from '@/contexts/ScoreStructureContext';
import { CourseContext } from '@/contexts/CourseContext';
import { ICourse, IScoreStructure } from '@/types';
import { getLeafColumns } from '@/utils';

const ScoreStructureTable: React.FC = () => {
  const { scoreStructure } = useContext(ScoreStructureContext);
  const { course } = useContext(CourseContext) as { course: ICourse };

  if (!scoreStructure) {
    return <div>Đang tải bảng điểm...</div>;
  }

  const leafColumns = getLeafColumns(scoreStructure);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Bảng điểm</h2>
      <table className="w-full border border-collapse border-gray-300">
        <thead>
          <tr>
            <th rowSpan={2} className="px-4 py-2 text-left align-bottom bg-gray-200 border">
              Tên sinh viên
            </th>
          </tr>
          <tr>
            {leafColumns.map((leaf: IScoreStructure) => (
              <th key={leaf.id} className="px-4 py-2 text-center bg-gray-200 border">
                {leaf.columnName} ({leaf.percent}%)
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {course.students?.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{student.userName}</td>
              {leafColumns.map((leaf: IScoreStructure) => (
                <td key={`${student.id}-${leaf.id}`} className="px-4 py-2 text-center border">
                  {Math.floor(Math.random() * 20) + 80}{' '}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreStructureTable;
