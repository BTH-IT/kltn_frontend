'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';

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

  const handlePrintClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    reactToPrintFn();
  };

  return (
    <div className="p-4">
      <div className="p-3" ref={contentRef}>
        <h2 className="text-2xl font-bold mb-4">Bảng điểm</h2>
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
      <div className="w-full flex justify-end mt-5">
        <Button className="flex gap-2" onClick={handlePrintClick}>
          <Printer className="w-4 h-4" />
          In bảng điểm
        </Button>
      </div>
    </div>
  );
};

export default ScoreStructureTable;
