'use client';
import React, { Dispatch, SetStateAction } from 'react';
import Markdown from 'react-markdown';
import { CalendarIcon, FileTextIcon } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IReport } from '@/types';
import { formatVNDate } from '@/utils';

const BriefGroupReportModal = ({
  isOpen,
  setIsOpen,
  report,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  report: IReport | null;
}) => {
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[95vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader className="h-fit">
          <DialogTitle>Chỉnh sửa mục mới</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin ở đây.</DialogDescription>
        </DialogHeader>
        <div
          key={report?.brief?.id}
          className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileTextIcon className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">{report?.brief?.title}</h2>
              </div>
            </div>
            <div className="text-gray-600 markdown">
              <Markdown>{report?.brief?.content}</Markdown>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatVNDate(report?.brief?.createdAt || '')}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BriefGroupReportModal;
