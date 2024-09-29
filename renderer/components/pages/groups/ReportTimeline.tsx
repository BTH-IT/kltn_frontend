'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Plus, Edit, Trash } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
const AddGroupReportModal = dynamic(() => import('@/components/modals/AddGroupReportModal'), { ssr: false });
const EditGroupReportModal = dynamic(() => import('@/components/modals/EditGroupReportModal'), { ssr: false });
import CommonModal from '@/components/modals/CommonModal';
import reportService from '@/services/reportService';
import { IGroup, IReport } from '@/types';
import { formatVNDate } from '@/utils';
import AnnouncementAttachList from '@/components/common/AnnouncementAttachList';

type Comment = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
};

const ReportTimeline = ({ group }: { group: IGroup }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [reports, setReports] = useState<IReport[]>([]);
  const [addingReport, setAddingReport] = useState(false);
  const [editingReport, setEditingReport] = useState(false);
  const [deletingReport, setDeletingReport] = useState(false);
  const [currentReport, setCurrentReport] = useState<IReport | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [editingComment, setEditingComment] = useState<{
    itemId: number;
    comment: Comment;
  } | null>(null);

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

  // const handleDeleteComment = (itemId: number, commentId: number) => {
  //   setTimelineItems((prev) =>
  //     prev.map((item) =>
  //       item.id === itemId
  //         ? {
  //             ...item,
  //             comments: item.comments.filter((c) => c.id !== commentId),
  //           }
  //         : item,
  //     ),
  //   );
  // };

  // const handleAddTimelineItem = () => {
  //   const newItem: TimelineItem = {
  //     id: Date.now(),
  //     title: 'Mục mới',
  //     description: 'Mô tả cho mục mới',
  //     date: new Date().toISOString().split('T')[0],
  //     comments: [],
  //   };
  //   setTimelineItems((prev) => [...prev, newItem]);
  // };

  // const handleEditTimelineItem = (item: TimelineItem) => {};

  // const handleDeleteTimelineItem = (id: number) => {
  //   setTimelineItems((prev) => prev.filter((item) => item.id !== id));
  // };

  // const handleSaveTimelineItem = (updatedItem: TimelineItem) => {
  //   setTimelineItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  // };

  return (
    <>
      {isMounted && (
        <>
          <Card className="w-full bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50">
              <CardTitle className="text-2xl font-bold text-gray-800">Báo cáo dự án</CardTitle>
              <Button
                onClick={() => {
                  setAddingReport(true);
                }}
                className="text-white bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm mục mới
              </Button>
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
                            className="mb-4 prose text-gray-700 max-w-none"
                            dangerouslySetInnerHTML={{ __html: report.content }}
                          />
                          <AnnouncementAttachList links={report.attachedLinks || []} files={report.attachments || []} />
                          {/* <div className="space-y-4">
                        {report.comments.map((comment) => (
                          <div key={comment.commentId} className="p-4 rounded-lg shadow-sm bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage
                                    src={comment.user?.avatar || '/images/avt.png'}
                                    alt={comment.user?.userName || comment.user?.fullName}
                                  />
                                </Avatar>
                                <span className="font-medium text-gray-700">{comment.user?.fullName}</span>
                                <span className="text-sm text-gray-500">{comment.createdAt}</span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                  // onClick={() =>
                                  //   setEditingComment({
                                  //     itemId: comment.commentId,
                                  //     comment,
                                  //   })
                                  // }
                                  >
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                  // onClick={() => handleDeleteComment(item.id, comment.id)}
                                  >
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="text-gray-600">{comment.content}</p>
                          </div>
                        ))}
                      </div> */}
                          <div className="mt-4">
                            <textarea
                              placeholder="Thêm bình luận..."
                              value={newComment}
                              // onChange={(e) => setNewComment(e.target.value)}
                              className="w-full min-h-[100px] p-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Button
                              // onClick={() => handleAddComment(item.id)}
                              className="w-full text-white bg-green-500 hover:bg-green-600"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Gửi bình luận
                            </Button>
                          </div>
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
