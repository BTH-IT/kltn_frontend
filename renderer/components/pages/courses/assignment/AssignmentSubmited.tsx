'use client';

import { useContext, useEffect, useRef, useState, MouseEventHandler } from 'react';
import { Settings2, Search, Calendar as CalendarIcon, FileText, Printer, ArrowLeftFromLine } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import assignmentService from '@/services/assignmentService';
import { ISubmissionList } from '@/types';
import { AssignmentContext } from '@/contexts/AssignmentContext';
import SubmissionDetailModal from '@/components/modals/SubmissionDetailModal';
import EditAssignmentHmWorkModal from '@/components/modals/EditAssigmentHmWorkModal';
import CommonModal from '@/components/modals/CommonModal';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

export default function AssigmentSubmited({ submissions }: { submissions: ISubmissionList[] }) {
  const router = useRouter();

  const { assignment } = useContext(AssignmentContext);
  const { setItems } = useContext(BreadcrumbContext);

  useEffect(() => {
    if (!assignment || !assignment.course) return;

    const breadcrumbLabel1 = assignment.course.name;
    const breadcrumbLabel2 = assignment.title;

    setItems([
      { label: 'Lớp học', href: '/' },
      {
        label: breadcrumbLabel1,
        href: `/courses/${assignment.course.courseId}`,
      },
      {
        label: 'Bài tập',
        href: `/courses/${assignment.course.courseId}/assignments`,
      },
      { label: breadcrumbLabel2 },
    ]);
  }, [assignment, setItems]);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [searchTerm, setSearchTerm] = useState('');
  const [studentSubmissions, setStudentSubmissions] = useState<ISubmissionList[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStudent, setSelectedStudent] = useState<ISubmissionList | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setStudentSubmissions(submissions);
  }, [submissions]);

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
    submitted: studentSubmissions.filter((student) => categorizeStudentStatus(student) === 'Đã nộp').length,
    graded: studentSubmissions.filter((student) => categorizeStudentStatus(student) === 'Đã chấm bài').length,
    notSubmit: studentSubmissions.filter(
      (student) =>
        categorizeStudentStatus(student) === 'Chưa nộp bài' ||
        categorizeStudentStatus(student) === 'Trễ hạn' ||
        categorizeStudentStatus(student) === 'Đã giao',
    ).length,
  };

  const filteredStudents = studentSubmissions.filter(
    (student) =>
      student.user.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedDate ||
        (student.submission?.createdAt &&
          format(new Date(student.submission.createdAt), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))),
  );

  const handleRemove = async () => {
    if (!assignment) return;
    try {
      const res = await assignmentService.deleteAssignment(assignment.assignmentId);
      if (res) {
        router.refresh();
        router.push(`/courses/${assignment.courseId}/assignments`);
        toast.success('Đã xoá bài tập thành công');
      }
    } catch (err) {
      console.error('Failed to delete assignment: ', err);
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || err.message);
      }
    }
  };

  const handlePrintClick: MouseEventHandler<HTMLButtonElement> = () => {
    reactToPrintFn();
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{assignment?.title || ''}</h1>
        <div className="flex items-center space-x-2">
          <ArrowLeftFromLine
            className="w-5 h-5 cursor-pointer"
            onClick={() => {
              router.push(`/courses/${assignment?.courseId}/assignments/${assignment?.assignmentId}`);
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Settings2 className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditModalOpen(true);
                  }}
                >
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {assignment?.scoreStructure ? (
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
      ) : (
        <div className="grid grid-cols-12 gap-4 mb-6">
          <Card className="col-span-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Đã nộp</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.submitted}</div>
            </CardContent>
          </Card>
          <Card className="col-span-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Chưa nộp bài</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.notSubmit}</div>
            </CardContent>
          </Card>
        </div>
      )}

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

      <div className="p-3" ref={contentRef}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sinh viên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày nộp</TableHead>
              <TableHead>Điểm</TableHead>
              <TableHead className="toHide">Xem và chấm bài</TableHead>
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
                    {student.user.userName} - {student.user.fullName || 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={categorizeStudentStatus(student) === 'Đã chấm bài' ? 'done' : 'default'}>
                    {categorizeStudentStatus(student)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {student.submission ? format(new Date(student.submission.createdAt), 'yyyy-MM-dd') : 'N/A'}
                </TableCell>
                <TableCell>{student.score !== null ? student.score : 'Chưa chấm bài'}</TableCell>
                <TableCell className="toHide">
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

      <div className="flex justify-end w-full mt-5">
        <Button className="flex gap-2" onClick={handlePrintClick}>
          <Printer className="w-4 h-4" />
          In bảng điểm
        </Button>
      </div>
      {assignment && (
        <EditAssignmentHmWorkModal
          onOpenModal={isEditModalOpen}
          setOnOpenModal={setIsEditModalOpen}
          assignment={assignment}
        />
      )}
      <CommonModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        width={500}
        height={150}
        title="Bạn có chắc muốn xoá bài tập này không?"
        acceptTitle="Xoá"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        ocClickAccept={async () => {
          await handleRemove();
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
}
