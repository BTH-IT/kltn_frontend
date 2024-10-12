/* eslint-disable no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
const AddGroupReportModal = dynamic(() => import('@/components/modals/AddGroupReportModal'), { ssr: false });
const EditGroupReportModal = dynamic(() => import('@/components/modals/EditGroupReportModal'), { ssr: false });
import CommonModal from '@/components/modals/CommonModal';
import reportService from '@/services/reportService';
import { IGroup, IReport, IUser } from '@/types';
import { formatVNDate, KEY_LOCALSTORAGE } from '@/utils';
import AnnouncementAttachList from '@/components/common/AnnouncementAttachList';
import ReportCommentList from '@/components/common/ReportCommentList';
import { generateParagraphs } from '@/libs/utils';
import briefService from '@/services/briefService';

const ReportTimeline = ({ group }: { group: IGroup }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [reports, setReports] = useState<IReport[]>([]);
  const [addingReport, setAddingReport] = useState(false);
  const [editingReport, setEditingReport] = useState(false);
  const [deletingReport, setDeletingReport] = useState(false);
  const [currentReport, setCurrentReport] = useState<IReport | null>(null);
  const [currentUser, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER);
      setUser(user ? JSON.parse(user) : null);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const fetchReports = async () => {
      const res = await reportService.getReports(group.groupId);
      if (res.data) {
        setReports(res.data.reverse());
      }
    };

    fetchReports();
  }, [group.groupId]);

  const handleDeleteReport = async (reportId: string) => {
    try {
      const res = await reportService.deleteReport(group.groupId, reportId);
      if (res.data) {
        setReports(reports.filter((report) => report.reportId !== reportId));
        toast.success('Xoá mục báo cáo thành công');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  const handleGenerateBrief = async () => {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY || '');
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro-002',
    });

    const prompt =
      'Tôi muốn một bản tóm tắt chi tiết về tiến độ của phần viết báo cáo, bao gồm cả những thông tin về cấu trúc và nội dung của báo cáo sau (chỉ lấy nội dung tóm tắt): ';

    const res = await reportService.getReports(group.groupId);

    if (!res.data) return;

    const fullPrompt = prompt + generateParagraphs(res.data);

    const result = await model.generateContent(fullPrompt);

    const content = result.response.text();

    await briefService.createBrief(group.groupId, {
      title: 'Tóm tắt báo cáo lúc ' + formatVNDate(new Date().toString()),
      content,
    });

    toast.success('Tạo tóm tắt báo cáo thành công');
  };

  return (
    <>
      {isMounted && (
        <>
          <Card className="w-full bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50">
              <CardTitle className="text-2xl font-bold text-gray-800">Báo cáo dự án</CardTitle>
              <div className="flex items-center justify-center gap-2">
                <Button onClick={handleGenerateBrief} className="text-white bg-blue-500 hover:bg-blue-600">
                  Tóm tắt báo cáo
                </Button>

                <Button
                  onClick={() => {
                    setAddingReport(true);
                  }}
                  className="text-white bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm mục mới
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion
                type="multiple"
                defaultValue={reports.map((report) => report.reportId.toString())}
                className="w-full"
              >
                {reports.map((report, idx) => (
                  <AccordionItem
                    key={report.reportId}
                    value={report.reportId.toString()}
                    className="pr-4 border-b last:border-b-0"
                  >
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
                            className="mb-4 prose text-gray-700 max-w-none markdown"
                            dangerouslySetInnerHTML={{ __html: report.content }}
                          />
                          <AnnouncementAttachList links={report.attachedLinks || []} files={report.attachments || []} />
                          <ReportCommentList report={report} currentUser={currentUser} />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          <AddGroupReportModal
            isOpen={addingReport}
            setIsOpen={setAddingReport}
            reports={reports}
            setReports={setReports}
            group={group}
          />
          <EditGroupReportModal
            isOpen={editingReport}
            setIsOpen={setEditingReport}
            reports={reports}
            setReports={setReports}
            report={currentReport}
          />
          <CommonModal
            isOpen={deletingReport}
            setIsOpen={setDeletingReport}
            width={400}
            height={150}
            title="Bạn có muốn xoá mục này không?"
            acceptTitle="Xoá"
            acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
            ocClickAccept={async () => {
              if (currentReport) {
                await handleDeleteReport(currentReport.reportId);
                setDeletingReport(false);
              }
            }}
          />
        </>
      )}
    </>
  );
};

export default ReportTimeline;
