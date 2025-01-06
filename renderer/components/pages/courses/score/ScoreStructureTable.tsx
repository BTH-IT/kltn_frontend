'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ClipboardList, Printer } from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import { motion } from 'framer-motion';
import ReactSelect from 'react-select';
import { useRouter } from 'next/navigation';

import { ScoreStructureContext } from '@/contexts/ScoreStructureContext';
import { CourseContext } from '@/contexts/CourseContext';
import { getLeafColumns, KEY_LOCALSTORAGE } from '@/utils';
import scoreStructureService from '@/services/scoreStructureService';
import { ITranscript } from '@/types/transcript';
import { ICourse, IScoreStructure, IUser } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ScoreStructureTable: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const { scoreStructure } = useContext(ScoreStructureContext) as {
    scoreStructure: IScoreStructure;
  };
  const { course } = useContext(CourseContext) as { course: ICourse };
  const [transcripts, setTranscripts] = useState<ITranscript[]>([]);
  const [exportOption, setExportOption] = useState<'full' | 'scoresOnly' | 'infosOnly'>('full');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, [router]);

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

  const leafColumns = course.setting.hasFinalScore
    ? getLeafColumns(scoreStructure)
    : getLeafColumns(scoreStructure)?.filter((leaf) => leaf.columnName !== 'Cuối kì');

  const getStudentScores = (studentId: string) => {
    const transcript = transcripts.find((t) => t.id === studentId);
    return transcript ? transcript.scores : {};
  };

  const handleExportExcel = () => {
    const data = course.students?.map((student) => {
      const studentScores: any = getStudentScores(student.id);
      const score = getLeafColumns(studentScores);
      const row: Record<string, any> = {};

      row['MSSV'] = student.customId;
      row['Họ tên'] = student.fullName || 'N/A';
      row['Email'] = student.email;

      if (exportOption === 'infosOnly') {
        return row; // Chỉ export tên sinh viên
      } else if (exportOption === 'scoresOnly' || exportOption === 'full') {
        leafColumns.forEach((leaf: any) => {
          if (exportOption === 'full' || selectedColumns.includes(leaf.id)) {
            row[`${leaf.columnName} (${leaf.percent}%)`] =
              score.find((x: any) => x.scoreStructureId === leaf.id)?.value ?? '-';
          }
        });

        if (exportOption === 'full') {
          row['Tổng điểm'] = studentScores.value ?? '-';
        }
      }

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
    <div className="overflow-x-auto scores-step-1">
      {course.students && course.students.length > 0 ? (
        <>
          <div className="pb-3" ref={contentRef}>
            <div className="flex items-center justify-between gap-2 mb-6">
              <h2 className="flex-shrink-0 text-2xl font-bold">Bảng điểm</h2>
              <div className="flex items-center gap-3">
                <Select
                  onValueChange={(value) => setExportOption(value as 'full' | 'scoresOnly' | 'infosOnly')}
                  value={exportOption}
                >
                  <SelectTrigger className="w-40 mr-4">
                    <SelectValue placeholder="Chọn chế độ xuất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Toàn bộ bảng</SelectItem>
                    <SelectItem value="scoresOnly">Chỉ cột điểm</SelectItem>
                    <SelectItem value="infosOnly">Chỉ thông tin sinh viên</SelectItem>
                  </SelectContent>
                </Select>
                {exportOption === 'scoresOnly' && (
                  <ReactSelect
                    options={[
                      {
                        value: 'all',
                        label: 'Chọn tất cả các cột',
                      },
                      ...leafColumns.map((leaf: any) => ({
                        value: leaf.id,
                        label: `${leaf.columnName} (${leaf.percent}%)`,
                      })),
                    ]}
                    isMulti
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions.map((option) => option.value);
                      if (selectedValues.includes('all')) {
                        setSelectedColumns(leafColumns.map((leaf: any) => leaf.id));
                      } else {
                        setSelectedColumns(selectedValues);
                      }
                    }}
                    value={[
                      ...(selectedColumns.length === leafColumns.length
                        ? [{ value: 'all', label: 'Chọn tất cả các cột' }]
                        : []),
                      ...leafColumns
                        .filter((leaf: any) => selectedColumns.includes(leaf.id))
                        .map((leaf: any) => ({
                          value: leaf.id,
                          label: `${leaf.columnName} (${leaf.percent}%)`,
                        })),
                    ]}
                    className="mr-4"
                    placeholder="Chọn các cột điểm"
                  />
                )}
              </div>
            </div>
            <table className="w-full border border-collapse border-gray-300">
              <thead>
                <tr>
                  <th rowSpan={2} className="px-4 py-2 text-center bg-gray-200 border">
                    MSSV
                  </th>
                  <th rowSpan={2} className="px-4 py-2 text-center bg-gray-200 border">
                    Họ tên
                  </th>
                  <th rowSpan={2} className="px-4 py-2 text-center bg-gray-200 border">
                    Email
                  </th>
                </tr>
                <tr>
                  {leafColumns.map(
                    (leaf: any) =>
                      (exportOption === 'full' || selectedColumns.includes(leaf.id)) && (
                        <th key={leaf.id} className="px-4 py-2 text-center bg-gray-200 border">
                          {leaf.columnName} ({leaf.percent}%)
                        </th>
                      ),
                  )}
                  {exportOption === 'full' && <th className="px-4 py-2 text-center bg-gray-200 border">Tổng điểm</th>}
                </tr>
              </thead>
              <tbody>
                {course.students?.map((student) => {
                  const studentScores: any = getStudentScores(student.id);
                  const score = getLeafColumns(studentScores);

                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{student.customId}</td>
                      <td className="px-4 py-2 border">{student.fullName || 'N/A'}</td>
                      <td className="px-4 py-2 border">{student.email}</td>
                      {leafColumns.map(
                        (leaf: any) =>
                          (exportOption === 'full' || selectedColumns.includes(leaf.id)) && (
                            <td key={`${student.id}-${leaf.id}`} className="px-4 py-2 text-center border">
                              {score.find((x: any) => x.scoreStructureId === leaf.id)?.value ?? '-'}
                            </td>
                          ),
                      )}
                      {exportOption === 'full' && (
                        <td className="px-4 py-2 text-center border">{studentScores.value}</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {user?.id === course?.lecturerId && (
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
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[500px] p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <ClipboardList className="w-20 h-20 mx-auto mb-4 text-blue-500" />
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Chưa có sinh viên nào đăng ký</h2>
            <p className="max-w-lg mb-6 text-gray-600">
              Khóa học này hiện chưa có sinh viên nào đăng ký. Hãy thêm sinh viên hoặc khám phá các tính năng khác của
              hệ thống.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ScoreStructureTable;
