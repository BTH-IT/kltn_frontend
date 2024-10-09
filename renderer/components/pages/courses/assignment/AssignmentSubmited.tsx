'use client';

import { useContext, useEffect, useState } from 'react';
import { Settings2, Search, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import assignmentService from '@/services/assignmentService';
import { ISubmissionList } from '@/types';
import { AssignmentContext } from '@/contexts/AssignmentContext';
import SubmissionDetailModal from '@/components/modals/SubmissionDetailModal';

export default function AssigmentSubmited() {
  const params = useParams();
  const { assignment } = useContext(AssignmentContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<ISubmissionList[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStudent, setSelectedStudent] = useState<ISubmissionList | null>(null);

  useEffect(() => {
    const handleData = async () => {
      try {
        const res = await assignmentService.getSubmissionsById(params.assignmentId as string);
        setStudents(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    handleData();
  }, [params.assignmentId]);

  const now = new Date();

  const categorizeStudentStatus = (student: ISubmissionList) => {
    const dueDate = new Date(assignment?.dueDate || '');

    if (!student?.submission) {
      if (assignment?.dueDate === null) return 'Đã giao';

      if (now <= dueDate) return 'Chưa nộp bài';

      return 'Trễ hạn';
    } else {
      if (student?.score === null) {
        return 'Đã nộp';
      } else {
        return 'Đã chấm bài';
      }
    }
  };

  const stats = {
    submitted: students.filter((student) => categorizeStudentStatus(student) === 'Đã nộp').length,
    graded: students.filter((student) => categorizeStudentStatus(student) === 'Đã chấm bài').length,
    notSubmit: students.filter((student) => categorizeStudentStatus(student) === 'Chưa nộp bài').length,
  };

  const filteredStudents = students.filter(
    (student) =>
      student.user.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedDate ||
        format(student.submission?.createdAt ?? '', 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')),
  );

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{assignment?.title || ''}</h1>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Đã nộp</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Đã chấm điểm</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.graded}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Chưa nộp bài</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notSubmit}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Tìm kiếm học viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {selectedDate ? format(selectedDate, 'PPP') : <span>Chọn ngày nộp bài</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sinh viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày nộp</TableHead>
            <TableHead>Điểm</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((student) => (
            <TableRow key={student.user.id}>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="w-8 h-8 mr-2">
                    <Image src={'/images/avt.png'} alt={student.user.userName} width={1000} height={1000} />
                  </Avatar>
                  {student.user.userName}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={categorizeStudentStatus(student) === 'Đã chấm bài' ? 'destructive' : 'default'}>
                  {categorizeStudentStatus(student)}
                </Badge>
              </TableCell>
              <TableCell>
                {student.submission ? format(new Date(student.submission.createdAt), 'yyyy-MM-dd') : 'N/A'}
              </TableCell>
              <TableCell>{student.score !== null ? student.score : 'Chưa chấm bài'}</TableCell>
              <TableCell>
                {student.submission && (
                  <SubmissionDetailModal
                    currentStudent={student}
                    student={selectedStudent}
                    setStudent={setSelectedStudent}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
