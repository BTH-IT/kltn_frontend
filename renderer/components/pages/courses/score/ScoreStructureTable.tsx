/* eslint-disable no-unused-vars */
'use client';
import React, { useContext } from 'react';

import { ScoreStructureContext } from '@/contexts/ScoreStructureContext';
import { CourseContext } from '@/contexts/CourseContext';
import { ICourse, IScoreStructure } from '@/types';

interface TableHeaderCellProps {
  item: IScoreStructure;
}

const TableHeaderCell: React.FC<TableHeaderCellProps> = ({ item }) => {
  const hasChildren = item.children.length > 0;

  return (
    <th
      className="p-2 text-center bg-gray-100 border border-gray-300"
      colSpan={hasChildren ? item.children.length : 1}
      rowSpan={hasChildren ? 1 : 2}
    >
      <div className="font-semibold">
        {item.columnName} ({item.percent}%)
      </div>
      {hasChildren && (
        <table className="w-full mt-2">
          <tbody>
            <tr>
              {item.children.map((child) => (
                <TableHeaderCell key={child.id} item={child} />
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </th>
  );
};

const getLeafColumns = (node: IScoreStructure): IScoreStructure[] => {
  const leaves: IScoreStructure[] = [];
  const traverse = (node: IScoreStructure) => {
    if (node.children.length === 0) {
      leaves.push(node);
    } else {
      node.children.forEach(traverse);
    }
  };
  traverse(node);
  return leaves;
};

const ScoreStructureTable: React.FC = () => {
  const { scoreStructure } = useContext(ScoreStructureContext) as {
    scoreStructure: IScoreStructure | null;
  };
  const { course } = useContext(CourseContext) as { course: ICourse };

  if (!scoreStructure) {
    // Return a loading or fallback UI if scoreStructure is null
    return <div>Loading...</div>;
  }

  const leafColumns = getLeafColumns(scoreStructure);

  return (
    <div className="p-6 text-white rounded-md bg-gradient-to-r from-blue-500 to-purple-500">
      <h2 className="mb-4 text-xl font-bold">Student Grades</h2>
      <div className="p-4 bg-white rounded-md shadow-md">
        <table className="min-w-full border border-collapse border-gray-300">
          <thead>
            <tr>
              <th rowSpan={2} className="px-4 py-2 text-left bg-gray-200 border border-gray-300">
                Student Name
              </th>
              <TableHeaderCell item={scoreStructure} />
            </tr>
            <tr></tr>
          </thead>
          <tbody>
            {course &&
              course.students?.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-2 border">{student.userName}</td>
                  {leafColumns.map((leaf) => (
                    <td key={`${student.id}-${leaf.id}`} className="px-4 py-2 text-center border">
                      {/* Placeholder for the score; you can replace it with actual data */}
                      {Math.floor(Math.random() * 20) + 80}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreStructureTable;
