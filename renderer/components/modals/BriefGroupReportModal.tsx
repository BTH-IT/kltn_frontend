/* eslint-disable max-len */
'use client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Markdown from 'react-markdown';
import { CalendarIcon, FileTextIcon, RotateCcw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IReport } from '@/types';
import { formatVNDate } from '@/utils';
import { generateParagraphs, logError } from '@/libs/utils';
import briefService from '@/services/briefService';

const BriefGroupReportModal = ({
  isOpen,
  setIsOpen,
  report,
  setCurrentReport,
  setReports,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  report: IReport | null;
  setCurrentReport: Dispatch<SetStateAction<IReport | null>>;
  setReports: Dispatch<SetStateAction<IReport[]>>;
}) => {
  const [isLoadingBrief, setIsLoadingBrief] = useState(false);
  const onClose = () => {
    setIsOpen(false);
  };

  const handleGenerateBrief = async () => {
    if (!report || !report.brief) return;

    try {
      setIsLoadingBrief(true);

      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY || '');
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro-002',
      });
      const prompt =
        'Tôi muốn một bản tóm tắt chi tiết về tiến độ của phần viết báo cáo, bao gồm cả những thông tin về cấu trúc và nội dung của báo cáo sau (chỉ lấy nội dung tóm tắt): ';

      const fullPrompt = prompt + generateParagraphs([report]);

      const result = await model.generateContent(fullPrompt);
      const content = result.response.text();

      // Create a new brief
      const res = await briefService.updateBrief(report.groupId, report.brief.id, {
        title: 'Tóm tắt báo cáo lúc ' + formatVNDate(new Date().toString()),
        content,
      });

      setCurrentReport({ ...report, brief: res.data });
      setReports((prevReports: IReport[]) =>
        prevReports.map((r) => (r.reportId === report.reportId ? { ...report, brief: res.data } : r)),
      );
    } catch (error) {
      logError(error);
    } finally {
      setIsLoadingBrief(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[95vh] h-auto overflow-y-auto overflow-x-hidden">
        <DialogHeader className="h-fit">
          <DialogTitle className="flex items-center gap-2">
            <span>Xem tóm tắt báo cáo tiến độ</span>
            {isLoadingBrief ? (
              <div
                className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              />
            ) : (
              <RotateCcw onClick={handleGenerateBrief} className="w-4 h-4 cursor-pointer" />
            )}
          </DialogTitle>
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
