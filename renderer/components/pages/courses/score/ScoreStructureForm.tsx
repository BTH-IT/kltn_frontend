/* eslint-disable no-unused-vars */
'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Plus, Minus, ChevronDown, ChevronRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IScoreStructure } from '@/types';
import scoreStructureService from '@/services/scoreStructureService';
import { CourseContext } from '@/contexts/CourseContext';
import { ScoreStructureContext } from '@/contexts/ScoreStructureContext';

export default function ScoreStructureForm() {
  const router = useRouter();
  const { course } = useContext(CourseContext);
  const { scoreStructure, setScoreStructure } = useContext(ScoreStructureContext);
  const [expandedColumns, setExpandedColumns] = useState<string[]>([]);

  useEffect(() => {
    if (course) {
      setScoreStructure(course.scoreStructure || null);
    }
  }, [course, setScoreStructure]);

  if (!scoreStructure) {
    return <p>Đang tải cấu trúc điểm...</p>;
  }

  const addSubColumn = (parentId: string) => {
    const newColumn: IScoreStructure = {
      id: uuidv4(),
      columnName: 'Cột con mới',
      percent: 0,
      parentId,
      maxPercent: 0,
      children: [],
    };

    const updatedScoreStructure = updateColumnTree(scoreStructure, parentId, (col) => {
      const updatedChildren = col.children || [];

      if (updatedChildren.length === 0) {
        const defaultChild1 = {
          ...newColumn,
          id: uuidv4(),
          columnName: 'Cột mặc định 1',
        };
        const defaultChild2 = {
          ...newColumn,
          id: uuidv4(),
          columnName: 'Cột mặc định 2',
        };
        return { ...col, children: [defaultChild1, defaultChild2] };
      }

      return {
        ...col,
        children: [...updatedChildren, newColumn],
      };
    });

    setScoreStructure(updatedScoreStructure);
    setExpandedColumns((prev) => [...prev, parentId]); // Mở rộng cột cha sau khi thêm cột con
  };

  const removeSubColumn = (id: string) => {
    // Hàm tìm và xóa cột con khỏi cây, đồng thời kiểm tra và xóa cột cha nếu cần
    const updatedScoreStructure = removeColumnAndCheckParent(scoreStructure, id);

    setScoreStructure(updatedScoreStructure);
  };

  const removeColumnAndCheckParent = (col: IScoreStructure, id: string): IScoreStructure => {
    if (col.children.some((child) => child.id === id)) {
      const updatedChildren = col.children.filter((child) => child.id !== id);
      if (updatedChildren.length < 2) {
        return {
          ...col,
          children: [],
        };
      } else {
        return {
          ...col,
          children: updatedChildren,
        };
      }
    }

    return {
      ...col,
      children: col.children?.map((subCol) => removeColumnAndCheckParent(subCol, id)),
    };
  };

  const updateColumn = (id: string, updates: Partial<IScoreStructure>) => {
    const updatedScoreStructure = updateColumnTree(scoreStructure, id, (col) => ({
      ...col,
      ...updates,
    }));
    setScoreStructure(updatedScoreStructure);
  };

  const toggleExpand = (id: string) => {
    setExpandedColumns((prev) => (prev.includes(id) ? prev.filter((colId) => colId !== id) : [...prev, id]));
  };

  const updateColumnTree = (
    col: IScoreStructure,
    id: string,
    updateFn: (col: IScoreStructure) => IScoreStructure,
  ): IScoreStructure => {
    if (col.id === id) {
      return updateFn(col);
    }

    return {
      ...col,
      children: col.children?.map((subCol) => updateColumnTree(subCol, id, updateFn)),
    };
  };

  const renderColumns = (column: IScoreStructure, depth = 0): React.ReactNode => {
    const hasChildren = column.children?.length > 0;

    return (
      <React.Fragment key={column.id}>
        <TableRow>
          <TableCell>
            <div className="flex items-center" style={{ paddingLeft: `${depth * 20}px` }}>
              {column.children?.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 mr-2"
                  onClick={() => toggleExpand(column.id)}
                >
                  {expandedColumns.includes(column.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              )}
              <Input
                value={column.columnName}
                onChange={(e) => updateColumn(column.id, { columnName: e.target.value })}
                className="max-w-[150px]"
                disabled={
                  column.id === scoreStructure.children?.[1]?.id // Không cho phép chỉnh sửa đối với cột Final Exam
                }
              />
            </div>
          </TableCell>
          <TableCell>
            <Input
              type="number"
              value={column.percent}
              onChange={(e) => updateColumn(column.id, { percent: Number(e.target.value) })}
              className="max-w-[80px]"
              disabled={
                hasChildren ||
                column.id === scoreStructure.children?.[0]?.id ||
                column.id === scoreStructure.children?.[1]?.id // Không cho phép chỉnh sửa phần trăm đối với Process và Final Exam
              }
            />
          </TableCell>
          <TableCell className="text-right">
            {column.parentId !== null && column.id !== scoreStructure.children?.[1]?.id && (
              <Button
                type="button"
                onClick={() => addSubColumn(column.id)}
                size="sm"
                variant="outline"
                className="mr-2"
              >
                <Plus className="w-4 h-4 mr-2" />
              </Button>
            )}
            {column.id !== scoreStructure.children?.[1]?.id && // Chỉ hiển thị các nút này cho các cột không phải Final Exam
              column.id !== scoreStructure.children?.[0]?.id && ( // Không hiển thị cho cột Process
                <>
                  {depth > 0 && ( // Chỉ cho phép xóa cột con
                    <Button type="button" onClick={() => removeSubColumn(column.id)} size="sm" variant="destructive">
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </>
              )}
          </TableCell>
        </TableRow>
        {expandedColumns.includes(column.id) && column.children?.map((subCol) => renderColumns(subCol, depth + 1))}
      </React.Fragment>
    );
  };

  const calculateTotalPercentage = (col: IScoreStructure): number => {
    if (col.children?.length === 0) {
      return col.percent;
    }
    return col.children?.reduce((sum, subCol) => sum + calculateTotalPercentage(subCol), 0);
  };

  console.log(scoreStructure);

  const processPercentage = calculateTotalPercentage(scoreStructure.children?.[0] || { percent: 0 });
  const finalExamPercentage = scoreStructure.children?.[1]?.percent || 0;
  const totalPercentage = processPercentage + finalExamPercentage;

  const handleSubmit = async () => {
    if (!course || !scoreStructure) return;

    if (totalPercentage !== 100) {
      toast.error('Tổng điểm phải bằng 100%. Vui lòng điều chỉnh lại phần trăm.');
      return;
    }

    try {
      // Chuẩn bị cấu trúc điểm đầy đủ với tất cả cột con
      const payload = {
        id: scoreStructure.id,
        columnName: scoreStructure.columnName,
        percent: scoreStructure.percent,
        courseId: course.courseId,
        maxPercent: scoreStructure.maxPercent as number,
        parentId: null,
        children: scoreStructure.children, // Bao gồm cấu trúc con đầy đủ
      };

      await scoreStructureService.createScoreStructure(payload);
      toast.success('Cập nhật cấu trúc điểm thành công!');
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="w-full px-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Tên cột</TableHead>
            <TableHead>Phần trăm</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderColumns(scoreStructure)}</TableBody>
      </Table>
      <div className="mt-4 text-right">
        Tổng điểm quá trình: {processPercentage.toFixed(2)}%
        <br />
        Thi cuối kỳ: {finalExamPercentage.toFixed(2)}%
        <br />
        Tổng cộng: {totalPercentage.toFixed(2)}%
      </div>
      <div className="flex items-center justify-end gap-2 mt-4">
        <Button
          type="button"
          onClick={() => {
            if (course) {
              setScoreStructure(course.scoreStructure);
            }
          }}
          variant="primary"
          disabled={totalPercentage !== 100}
        >
          Reset
        </Button>
        <Button type="button" onClick={handleSubmit} variant="primary" disabled={totalPercentage !== 100}>
          Cập nhật
        </Button>
      </div>
    </div>
  );
}
