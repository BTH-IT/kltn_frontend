'use client';

import { useState } from 'react';
import { Settings2, Mail, Search, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const students = [
  {
    id: 1,
    name: 'Phúc Huy Nguyễn',
    status: 'Đã giao',
    submittedDate: '2023-07-10',
    grade: null,
  },
  {
    id: 2,
    name: 'Biện Thành Hưng',
    status: 'Đã trả lại',
    submittedDate: '2023-07-09',
    grade: 4.5,
  },
  {
    id: 3,
    name: 'Nguyễn Văn A',
    status: 'Chưa nộp',
    submittedDate: null,
    grade: null,
  },
  {
    id: 4,
    name: 'Trần Thị B',
    status: 'Đã nộp',
    submittedDate: '2023-07-11',
    grade: null,
  },
];

export default function AssigmentSubmited() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStudent, setSelectedStudent] = useState<(typeof students)[0] | null>(null);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedDate || student.submittedDate === format(selectedDate, 'yyyy-MM-dd')),
  );

  const stats = {
    submitted: students.filter((s) => s.status === 'Đã nộp' || s.status === 'Đã giao' || s.status === 'Đã trả lại')
      .length,
    graded: students.filter((s) => s.grade !== null).length,
    pending: students.filter((s) => s.status === 'Đã nộp' && s.grade === null).length,
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Học tập và làm theo 5 điều bác hồ dạy</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Trả bài</Button>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Chấm điểm
          </Button>
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
            <p className="text-xs text-muted-foreground">+0% từ tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Đã chấm điểm</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.graded}</div>
            <p className="text-xs text-muted-foreground">+0% từ tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Chờ chấm điểm</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">+0% từ tháng trước</p>
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
            <TableHead className="w-[40px]">
              <Checkbox />
            </TableHead>
            <TableHead>Học viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày nộp</TableHead>
            <TableHead>Điểm</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="w-8 h-8 mr-2">
                    <Image src={'/images/avt.png'} alt={student.name} width={1000} height={1000} />
                  </Avatar>
                  {student.name}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={student.status === 'Đã trả lại' ? 'destructive' : 'default'}>{student.status}</Badge>
              </TableCell>
              <TableCell>{student.submittedDate || 'N/A'}</TableCell>
              <TableCell>{student.grade !== null ? student.grade : 'Chưa chấm'}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)}>
                      Xem bài
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bài nộp của {selectedStudent?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <p>Trạng thái: {selectedStudent?.status}</p>
                      <p>Ngày nộp: {selectedStudent?.submittedDate || 'Chưa nộp'}</p>
                      <p>Điểm: {selectedStudent ? selectedStudent.grade : 'Chưa chấm'}</p>
                      <div className="mt-4">
                        <h4 className="mb-2 font-semibold">Nội dung bài nộp:</h4>
                        <p className="text-sm text-muted-foreground">(Nội dung bài nộp sẽ được hiển thị ở đây)</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
