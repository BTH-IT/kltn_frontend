'use client';

import { useContext, useEffect, useRef, useState, MouseEventHandler, Fragment } from 'react';
import { Settings2, Search, Calendar as CalendarIcon, FileText, Printer, ChevronRight, User } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';

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
import { IGroup, IGroupMember, ISubmissionList } from '@/types';
import { AssignmentContext } from '@/contexts/AssignmentContext';
import SubmissionDetailModal from '@/components/modals/SubmissionDetailModal';
import EditAssignmentHmWorkModal from '@/components/modals/EditAssigmentHmWorkModal';
import CommonModal from '@/components/modals/CommonModal';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';
import groupService from '@/services/groupService';

interface IGroupSubmission {
  group: IGroup;
  submittedMember: IGroupMember | null;
  groupLeader: IGroupMember | null;
  isSubmitted: boolean;
  submissionList: ISubmissionList | null;
}

export default function FinalAssigmentSubmited({ submissions }: { submissions: ISubmissionList[] }) {
  const router = useRouter();

  const { assignment } = useContext(AssignmentContext);
  const { setItems } = useContext(BreadcrumbContext);

  console.log(assignment);

  useEffect(() => {
    if (!assignment || !assignment.course) return;

    const breadcrumbLabel1 = assignment.course.name;
    const breadcrumbLabel2 = assignment.title;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel1, href: `/courses/${assignment.course.courseId}` },
      { label: 'Bài tập', href: `/courses/${assignment.course.courseId}/assignments` },
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
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [groupSubmissions, setGroupSubmissions] = useState<IGroupSubmission[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isAbleToPrint, setIsAbleToPrint] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await groupService.getGroupsByCourseId(assignment?.courseId || '');
        res && setGroups(res.data);
      } catch (err) {
        console.error('Failed to fetch groups: ', err);
      }
    };
    fetchGroups();

    setStudentSubmissions(submissions);
  }, [submissions, assignment]);

  useEffect(() => {
    const data: IGroupSubmission[] = [];

    groups.forEach((group) => {
      const groupMembers = group.groupMembers;
      if (!groupMembers) {
        return;
      }
      const groupLeader = groupMembers.find((member) => member.isLeader);
      if (!groupLeader) {
        return;
      }
      const submittedMember =
        groupMembers.find((member) => {
          const submission = submissions.find((sub) => sub.user.id === member.studentId && sub.submission);
          return submission;
        }) || null;
      const submissionList = submissions.find((sub) => sub.user.id === submittedMember?.studentId) || null;
      data.push({
        group,
        submittedMember,
        groupLeader,
        isSubmitted: submittedMember ? true : false,
        submissionList,
      });
    });

    setGroupSubmissions(data);
  }, [groups, submissions]);

  const now = new Date();

  const categorizeStudentStatus = (student: ISubmissionList | null) => {
    const dueDate = new Date(assignment?.dueDate || '');

    if (student && student.submission) {
      if (student?.score === null) {
        return 'Đã nộp';
      } else {
        return 'Đã chấm bài';
      }
    } else {
      if (assignment?.dueDate === null) return 'Đã giao';

      if (now <= dueDate) return 'Chưa nộp bài';

      return 'Trễ hạn';
    }
  };

  const categorizeStudentStatusColor = (student: ISubmissionList | null) => {
    const dueDate = new Date(assignment?.dueDate || '');

    if (student && student.submission) {
      if (student?.score === null) {
        return 'default';
      } else {
        return 'done';
      }
    } else {
      if (assignment?.dueDate === null) return 'secondary';

      if (now <= dueDate) return 'secondary';

      return 'destructive';
    }
  };

  const calcucalteStats = (student: ISubmissionList) => {
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

  const uniqueGroupIds = new Set();

  const stats = {
    submitted: studentSubmissions.filter((student) => {
      const stats = calcucalteStats(student);
      if (stats === 'Đã nộp' && !uniqueGroupIds.has(student.groupId)) {
        uniqueGroupIds.add(student.groupId);
        return true;
      }
      return false;
    }).length,
    graded: studentSubmissions.filter((student) => {
      const stats = calcucalteStats(student);
      if (stats === 'Đã chấm bài' && !uniqueGroupIds.has(student.groupId)) {
        uniqueGroupIds.add(student.groupId);
        return true;
      }
      return false;
    }).length,
    notSubmit: studentSubmissions.filter((student) => {
      const stats = calcucalteStats(student);
      if (stats === 'Chưa nộp bài' && !uniqueGroupIds.has(student.groupId)) {
        uniqueGroupIds.add(student.groupId);
        return true;
      }
      return false;
    }).length,
  };

  const filteredGroups = groupSubmissions.filter(
    (gs) =>
      gs.group.groupMembers?.some((m) => m.studentObj.fullName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedDate ||
        format(gs.submissionList?.submission?.createdAt ?? '', 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')),
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
    const groupIds: string[] = Array.from(uniqueGroupIds) as string[];
    setExpandedRows(new Set(groupIds));
    setIsAbleToPrint(true);
  };

  useEffect(() => {
    if (isAbleToPrint) {
      reactToPrintFn();
      setIsAbleToPrint(false);
    }
  }, [isAbleToPrint, reactToPrintFn]);

  const toggleRow = (id: string) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = new Set(prevExpandedRows);
      if (newExpandedRows.has(id)) {
        newExpandedRows.delete(id);
      } else {
        newExpandedRows.add(id);
      }
      return newExpandedRows;
    });
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{assignment?.title || ''}</h1>
        <div className="flex space-x-2">
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

      <div className="p-3" ref={contentRef}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sinh viên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày nộp</TableHead>
              <TableHead>Điểm</TableHead>
              <TableHead className="toHide">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.map((gs) => (
              <Fragment key={gs.group.groupId}>
                <TableRow>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 hover:bg-transparent"
                      onClick={() => toggleRow(gs.group.groupId)}
                      aria-expanded={expandedRows.has(gs.group.groupId)}
                    >
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          expandedRows.has(gs.group.groupId) ? 'rotate-90' : ''
                        }`}
                      />
                      <span className="sr-only">{expandedRows.has(gs.group.groupId) ? 'Collapse' : 'Expand'} row</span>
                    </Button>
                    <span className="ml-2 inline-flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {gs.submittedMember
                        ? gs.submittedMember.studentObj.fullName
                        : gs.groupLeader?.studentObj?.fullName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={categorizeStudentStatusColor(gs.submissionList)}>
                      {categorizeStudentStatus(gs.submissionList)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {gs.submissionList
                      ? format(new Date(gs.submissionList.submission?.createdAt || 'N/A'), 'yyyy-MM-dd')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {gs.submissionList !== null
                      ? gs.submissionList.score !== null
                        ? gs.submissionList.score
                        : 'Chưa chấm bài'
                      : 'Chưa nộp bài'}
                  </TableCell>
                  <TableCell className="text-right">
                    <TableCell className="toHide">
                      {gs.submissionList !== null && (
                        <SubmissionDetailModal
                          currentStudent={gs.submissionList}
                          student={selectedStudent}
                          setStudent={setSelectedStudent}
                          isGroup
                          groupName={gs.group.groupName}
                        />
                      )}
                    </TableCell>
                  </TableCell>
                </TableRow>
                {expandedRows.has(gs.group.groupId) && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <div className="bg-muted/50 p-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">Thành viên</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>MSSV</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {gs.group.groupMembers &&
                              gs.group.groupMembers
                                .filter((m) => {
                                  if (gs.submittedMember) {
                                    return m.studentId !== gs.submittedMember.studentId;
                                  }
                                  return !m.isLeader;
                                })
                                .map((member, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{member.studentObj?.fullName}</TableCell>
                                    <TableCell>{member.studentObj?.email}</TableCell>
                                    <TableCell>{`Student ID: ${member.studentObj?.customId}`}</TableCell>
                                  </TableRow>
                                ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="w-full flex justify-end mt-5">
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
          isFinal
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
