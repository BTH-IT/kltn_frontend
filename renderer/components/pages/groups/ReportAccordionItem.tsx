/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
'use client';
import React, { useState } from 'react';
import { Edit, ScrollText, Trash } from 'lucide-react';

import { IReport } from '@/types';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatVNDate } from '@/utils';
import AnnouncementAttachList from '@/components/common/AnnouncementAttachList';
import ReportCommentList from '@/components/common/ReportCommentList';

const ReportAccordionItem = ({
  report,
  idx,
  setCurrentReport,
  handleGenerateBrief,
  currentUser,
  setBriefReport,
  setEditingReport,
  setDeletingReport,
}: {
  report: IReport;
  idx: number;
  setCurrentReport: any;
  handleGenerateBrief: any;
  setBriefReport: any;
  setEditingReport: any;
  setDeletingReport: any;
  currentUser: any;
}) => {
  const [isLoadingBrief, setIsLoadingBrief] = useState(false);
  return (
    <AccordionItem key={report.reportId} value={report.reportId.toString()} className="pr-4 border-b last:border-b-0">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white bg-blue-500 rounded-full">
              {idx + 1}
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
              <p className="text-sm text-gray-500">{formatVNDate(report.createdAt)}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            {isLoadingBrief ? (
              <div
                className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              />
            ) : (
              <ScrollText
                onClick={async (e) => {
                  e.stopPropagation();
                  setCurrentReport(report);
                  if (!report.brief) {
                    try {
                      setIsLoadingBrief(true);
                      await handleGenerateBrief(report);

                      setIsLoadingBrief(false);
                    } catch (error) {
                      setIsLoadingBrief(false);
                    }
                  } else {
                    setBriefReport(true);
                  }
                }}
                className="w-4 h-4 text-green-500"
              />
            )}

            <Edit
              className="w-4 h-4 text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                setEditingReport(true);
                setCurrentReport(report);
              }}
            />
            <Trash
              className="w-4 h-4 text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                setDeletingReport(true);
                setCurrentReport(report);
              }}
            />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-6 py-4">
          <div className="pl-6 border-l-2 border-blue-200">
            <div
              className="mb-4 prose text-gray-700 max-w-none ql-editor"
              dangerouslySetInnerHTML={{ __html: report.content }}
            />
            <AnnouncementAttachList links={report.attachedLinks || []} files={report.attachments || []} />
            <ReportCommentList report={report} currentUser={currentUser} />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ReportAccordionItem;
