/* eslint-disable no-unused-vars */
'use client';
import React, { useContext } from 'react';

import { ScoreStructureContext } from '@/contexts/ScoreStructureContext';
import { TableCellProps } from '@/types';
import { buildTree, getLeafColumns } from '@/utils';
import { CourseContext } from '@/contexts/CourseContext';

import EditableCell from './EditTableCell';

const TableHeaderCell: React.FC<TableCellProps> = ({ data, item, leafColumns }) => {
  const children = data.filter((child) => child.parentId === item.id);

  return (
    <th
      className="p-[1px] text-center border-t border-r last:border-r-0 last:border-l-0"
      colSpan={children.length === 0 ? 1 : 100}
    >
      <div className="pt-2 m-auto font-semibold">
        {item.columnName} ({item.percent}%)
      </div>
      {children.length > 0 && (
        <table className="mt-2 w-full">
          <tbody>
            <tr>
              {children.map((child) => (
                <TableHeaderCell key={child.id} data={data} item={child} leafColumns={leafColumns} />
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </th>
  );
};

const ScoreStructureTable = () => {
  const { scoreStructures } = useContext(ScoreStructureContext);
  const { course } = useContext(CourseContext);
  const tree = buildTree(scoreStructures);

  const leafColumns = tree.flatMap(getLeafColumns);

  return (
    <table className="min-w-full border border-gray-300 border-collapse">
      <thead>
        <tr>
          <th rowSpan={2} className="px-4 py-2 text-left bg-gray-200 border">
            Tên sinh viên
          </th>
          {/* {tree.map((rootItem) => (
            <TableHeaderCell
              key={rootItem.id}
              data={scoreStructures}
              item={rootItem}
              leafColumns={leafColumns.length}
            />
          ))} */}
        </tr>
        <tr>
          {leafColumns.map((leaf) => (
            <th key={leaf.id} className="p-2 text-center bg-gray-200 border">
              {leaf.columnName} ({leaf.percent}%)
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {course &&
          course.students?.map((student, index) => (
            <tr key={student.userId}>
              <td className="px-4 py-2 border">{student.name}</td>
              {leafColumns.map((col) => (
                <EditableCell key={col.id} value={'1' || 'N/A'} onSave={(newValue) => {}} />
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default ScoreStructureTable;
