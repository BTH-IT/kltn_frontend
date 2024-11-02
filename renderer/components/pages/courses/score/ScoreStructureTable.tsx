'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import { utils, writeFile } from 'xlsx';

import { ScoreStructureContext } from '@/contexts/ScoreStructureContext';
import { CourseContext } from '@/contexts/CourseContext';
import { getLeafColumns } from '@/utils';
import scoreStructureService from '@/services/scoreStructureService';
import { ITranscript } from '@/types/transcript';
import { ICourse, IScoreStructure } from '@/types';
import { Button } from '@/components/ui/button';

const ScoreStructureTable: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const { scoreStructure } = useContext(ScoreStructureContext) as {
    scoreStructure: IScoreStructure;
  };
  const { course } = useContext(CourseContext) as { course: ICourse };
  const [transcripts, setTranscripts] = useState<ITranscript[]>([]);

  useEffect(() => {
    const fetchTranscripts = async () => {
      if (!course) return;

      try {
        const res = await scoreStructureService.getTranscript(course.courseId);
        setTranscripts(res.data);
      } catch (error) {
        console.error('Failed to fetch transcripts:', error);
      }
    };

    fetchTranscripts();
  }, [course, scoreStructure]);

  if (!scoreStructure || !transcripts) {
    return <div>Đang tải bảng điểm...</div>;
  }

  const leafColumns = getLeafColumns(scoreStructure);

  const getStudentScores = (studentId: string) => {
    const transcript = transcripts.find((t) => t.id === studentId);
    return transcript ? transcript.scores : {};
  };

  const handleExportExcel = () => {
    const data = course.students?.map((student) => {
      const studentScores: any = getStudentScores(student.id);
      const score = getLeafColumns(studentScores);
      const row: Record<string, any> = {
        'Tên sinh viên': student.userName,
      };

      leafColumns.forEach((leaf: any) => {
        row[`${leaf.columnName} (${leaf.percent}%)`] =
          score.find((x: any) => x.scoreStructureId === leaf.id)?.value ?? '-';
      });

      row['Tổng điểm'] = studentScores.value ?? '-';
      return row;
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Bảng điểm');
    writeFile(wb, 'Bang_diem.xlsx');
  };

  const handlePrintClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    reactToPrintFn();
  };

  return (
    <div className="p-4">
      <div className="p-3" ref={contentRef}>
        <h2 className="mb-4 text-2xl font-bold">Bảng điểm</h2>
        <table className="w-full border border-collapse border-gray-300">
          <thead>
            <tr>
              <th rowSpan={2} className="px-4 py-2 text-center bg-gray-200 border">
                Tên sinh viên
              </th>
            </tr>
            <tr>
              {leafColumns.map((leaf: any) => (
                <th key={leaf.id} className="px-4 py-2 text-center bg-gray-200 border">
                  {leaf.columnName} ({leaf.percent}%)
                </th>
              ))}
              <th className="px-4 py-2 text-center bg-gray-200 border">Tổng điểm</th>
            </tr>
          </thead>
          <tbody>
            {course.students?.map((student) => {
              const studentScores: any = getStudentScores(student.id);
              const score = getLeafColumns(studentScores);

              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{student.userName}</td>
                  {leafColumns.map((leaf: any) => (
                    <td key={`${student.id}-${leaf.id}`} className="px-4 py-2 text-center border">
                      {score.find((x: any) => x.scoreStructureId === leaf.id)?.value ?? '-'}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-center border">{studentScores.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end w-full mt-5">
        <Button className="flex gap-2" onClick={handleExportExcel}>
          <Printer className="w-4 h-4" />
          Xuất Excel
        </Button>
        <Button className="flex gap-2 ml-2" onClick={handlePrintClick}>
          <Printer className="w-4 h-4" />
          In bảng điểm
        </Button>
      </div>
    </div>
  );
};

export default ScoreStructureTable;
