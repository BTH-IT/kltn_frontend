'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, GraduationCapIcon, ClipboardIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ISubmissionList } from '@/types';
import scoreService from '@/services/scoreService';

import AnnouncementAttachList from '../common/AnnouncementAttachList';

interface StudentSubmissionDialogProps {
  currentStudent: ISubmissionList;
  student: ISubmissionList | null;
  setStudent: React.Dispatch<React.SetStateAction<ISubmissionList | null>>;
}

export default function SubmissionDetailModal({ currentStudent, student, setStudent }: StudentSubmissionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState<number | null>(student?.score || null);
  const [activeTab, setActiveTab] = useState('details');
  const router = useRouter();

  const getSubmissionStatus = (student: ISubmissionList | null) => {
    if (!student) return 'Không có thông tin';
    if (student.submission) {
      return student.score !== null ? 'Đã chấm' : 'Đã nộp';
    }
    return 'Chưa nộp';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã chấm':
        return 'bg-green-500';
      case 'Đã nộp':
        return 'bg-yellow-500';
      case 'Chưa nộp':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleScoreSubmit = async () => {
    if (score !== null && student?.submission?.submissionId) {
      await scoreService.createScoreSubmission(student?.submission?.submissionId, {
        value: score,
      });

      router.refresh();
    }
  };

  const status = getSubmissionStatus(student);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setStudent(currentStudent)}>
          Xem bài
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between space-x-3">
            <div className="flex items-center space-x-2 text-2xl font-bold">
              <Avatar className="w-10 h-10">
                <AvatarImage src={student?.user.avatar ?? '/images/avt.png'} alt={student?.user.userName} />
                <AvatarFallback>{student?.user.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>Bài nộp của {student?.user.userName ?? 'Sinh viên'}</span>
            </div>
            {student?.score !== null && (
              <div className="flex items-center space-x-2 text-sm">
                <GraduationCapIcon className="w-4 h-4" />
                <span>Điểm hiện tại: {student?.score !== null ? student?.score : 'Chưa chấm bài'}</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Chi tiết</TabsTrigger>
            <TabsTrigger value="grading">Chấm điểm</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className={`${getStatusColor(status)} text-white`}>
                  {status}
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    Ngày nộp:{' '}
                    {student?.submission
                      ? format(new Date(student.submission.createdAt), 'dd/MM/yyyy')
                      : 'Chưa nộp bài'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="flex items-center space-x-2 font-semibold">
                  <ClipboardIcon className="w-4 h-4" />
                  <span>Nội dung bài nộp:</span>
                </h4>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  {student?.submission?.description ? (
                    <div
                      className="markdown ql-editor"
                      dangerouslySetInnerHTML={{
                        __html: student.submission.description,
                      }}
                    />
                  ) : (
                    <p className="text-sm italic text-muted-foreground">Không có nội dung bài nộp</p>
                  )}
                </ScrollArea>
                <AnnouncementAttachList
                  links={student?.submission?.attachedLinks || []}
                  files={student?.submission?.attachments || []}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="grading">
            <div className="mt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="score">Điểm số</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="score"
                    min={0}
                    max={10}
                    step={0.1}
                    value={[score ?? 0]}
                    onValueChange={(value) => setScore(value[0])}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={score ?? ''}
                    onChange={(e) => setScore(parseFloat(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>
              <AnimatePresence>
                {score !== student?.score && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button onClick={handleScoreSubmit} className="w-full">
                      {student?.score !== undefined ? 'Cập nhật điểm' : 'Chấm điểm'}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />
                  Đạt: ≥ 5 điểm
                </span>
                <span className="flex items-center">
                  <XCircleIcon className="w-4 h-4 mr-1 text-red-500" />
                  Không đạt: &lt; 5 điểm
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
