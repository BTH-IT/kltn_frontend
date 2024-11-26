/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
'use client';

import { useContext, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
const AddGroupReportModal = dynamic(() => import('@/components/modals/AddGroupReportModal'), { ssr: false });
const EditGroupReportModal = dynamic(() => import('@/components/modals/EditGroupReportModal'), { ssr: false });
import CommonModal from '@/components/modals/CommonModal';
import reportService from '@/services/reportService';
import { IGroup, IReport, IUser } from '@/types';
import { formatVNDate, KEY_LOCALSTORAGE } from '@/utils';
import { generateParagraphs } from '@/libs/utils';
import briefService from '@/services/briefService';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';
import BriefGroupReportModal from '@/components/modals/BriefGroupReportModal';

import ReportAccordionItem from './ReportAccordionItem';

const ReportTimeline = ({ group }: { group: IGroup }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [reports, setReports] = useState<IReport[]>([]);
  const [addingReport, setAddingReport] = useState(false);
  const [editingReport, setEditingReport] = useState(false);
  const [briefReport, setBriefReport] = useState(false);
  const [deletingReport, setDeletingReport] = useState(false);
  const [currentReport, setCurrentReport] = useState<IReport | null>(null);
  const [currentUser, setUser] = useState<IUser | null>(null);
  const { setItems } = useContext(BreadcrumbContext);

  useEffect(() => {
    if (!group.course) return;

    const breadcrumbLabel1 = group.course.name;
    const breadcrumbLabel2 = group.groupName;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel1, href: `/courses/${group.course.courseId}` },
      {
        label: 'Đồ án / Tiểu luận',
        href: `/courses/${group.course.courseId}/projects`,
      },
      {
        label: breadcrumbLabel2,
        href: `/groups/${group.course.courseId}/${group.groupId}`,
      },
      { label: 'Báo cáo' },
    ]);
  }, [group, setItems]);

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

  const handleGenerateBrief = async (report: IReport) => {
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY || '');
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro-002',
      });
      const prompt =
        'Tôi muốn một bản tóm tắt chi tiết về tiến độ của phần viết báo cáo, bao gồm cả những thông tin về cấu trúc và nội dung của báo cáo sau (chỉ lấy nội dung tóm tắt): ';

      const fullPrompt = prompt + generateParagraphs([report]);

      const result = await model.generateContent(fullPrompt);
      const content = result.response.text();

      let res;
      const data = {
        title: 'Tóm tắt báo cáo lúc ' + formatVNDate(new Date().toString()),
        content,
        reportId: report.reportId,
      };

      // Create a new brief
      console.log(report.brief);
      if (report.brief) {
        res = await briefService.updateBrief(group.groupId, report.brief.id, data);
      } else {
        res = await briefService.createBrief(group.groupId, data);
      }

      // Update current report state
      setCurrentReport({ ...report, brief: res.data });
      setReports((prevReports: IReport[]) =>
        prevReports.map((r) => (r.reportId === report.reportId ? { ...report, brief: res.data } : r)),
      );

      // Set brief report flag
      setBriefReport(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  return (
    <>
      {isMounted && (
        <>
          <Card className="w-full bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50">
              <CardTitle className="text-2xl font-bold text-gray-800">Báo cáo tiến độ</CardTitle>
              <div className="flex items-center justify-center gap-2">
                <Button
                  onClick={() => {
                    setAddingReport(true);
                  }}
                  className="text-white bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Báo cáo tiến độ
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
                  <ReportAccordionItem
                    report={report}
                    idx={idx}
                    key={report.reportId}
                    setCurrentReport={setCurrentReport}
                    handleGenerateBrief={handleGenerateBrief}
                    currentUser={currentUser}
                    setBriefReport={setBriefReport}
                    setEditingReport={setEditingReport}
                    setDeletingReport={setDeletingReport}
                  />
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
          <BriefGroupReportModal
            isOpen={briefReport}
            setIsOpen={setBriefReport}
            report={currentReport}
            setCurrentReport={setCurrentReport}
            setReports={setReports}
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
