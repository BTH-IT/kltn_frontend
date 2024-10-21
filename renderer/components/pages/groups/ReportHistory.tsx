/* eslint-disable quotes */
/* eslint-disable max-len */
'use client';

import { useContext, useEffect, useState } from 'react';
import { CalendarIcon, FileTextIcon, ChevronRightIcon, TrashIcon } from 'lucide-react';
import Markdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { IBrief } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatVNDate } from '@/utils';
import CommonModal from '@/components/modals/CommonModal';
import briefService from '@/services/briefService';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

export default function ReportHistory({ briefs }: { briefs: IBrief[] }) {
  const [selectedBrief, setSelectedBrief] = useState<IBrief | null>(null);
  const [deletingReport, setDeletingReport] = useState(false);
  const router = useRouter();
  const { setItems } = useContext(BreadcrumbContext);

  useEffect(() => {
    if (!briefs[0].group?.course) return;

    const breadcrumbLabel1 = briefs[0].group?.course.name;
    const breadcrumbLabel2 = briefs[0].group?.groupName;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel1, href: `/courses/${briefs[0].group?.course.courseId}` },
      { label: 'Nhóm', href: `/courses/${briefs[0].group.course.courseId}/groups` },
      { label: breadcrumbLabel2, href: `/groups/${briefs[0].group?.groupId}` },
      { label: 'Tóm tắt lịch sử báo cáo' },
    ]);
  }, [briefs, setItems]);

  const handleDeleteReport = async () => {
    if (!selectedBrief) return;

    try {
      await briefService.deleteBrief(selectedBrief.groupId, selectedBrief.id);

      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="w-full p-8 mx-auto space-y-8 max-w-8xl">
      {briefs.length > 0 ? (
        briefs.map((brief) => (
          <div
            key={brief.id}
            className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileTextIcon className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-800">{brief.title}</h2>
                </div>
              </div>
              <div className="text-gray-600 line-clamp-2 markdown">
                <Markdown>{brief.content}</Markdown>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formatVNDate(brief.createdAt || '')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => setSelectedBrief(brief)}
                  >
                    Xem chi tiết
                    <ChevronRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center opacity-75">Chưa có tóm tắt nào cả</p>
      )}

      <Dialog open={selectedBrief !== null} onOpenChange={() => setSelectedBrief(null)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-lg shadow-xl">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-800">{selectedBrief?.title}</DialogTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDeletingReport(true);
                  }}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <DialogDescription className="flex items-center mt-2 text-sm text-gray-500">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Ngày tạo: {formatVNDate(selectedBrief?.createdAt || '')}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-6 pt-2">
            <h3 className="mb-2 text-lg font-semibold text-gray-700">Tóm tắt</h3>
            <Markdown className="markdown">{selectedBrief?.content}</Markdown>
          </ScrollArea>
          <DialogFooter className="p-6 bg-gray-50">
            <Button variant="outline" onClick={() => setSelectedBrief(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CommonModal
        isOpen={deletingReport}
        setIsOpen={setDeletingReport}
        width={400}
        height={150}
        title="Bạn có muốn xoá bản tóm tắt này không?"
        acceptTitle="Xoá"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        ocClickAccept={async () => {
          if (selectedBrief) {
            await handleDeleteReport();
            setDeletingReport(false);
          }
        }}
      />
    </div>
  );
}
