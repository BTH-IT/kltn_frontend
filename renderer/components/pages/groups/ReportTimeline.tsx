'use client';

import { useEffect, useState } from 'react';
import {
  MessageSquare,
  Plus,
  Edit,
  Trash,
  Image as ImageIcon,
  Link as LinkIcon,
  Paperclip,
  MoreVertical,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AddGroupReportModal from '@/components/modals/AddGroupReportModal';
import EditGroupReportModal from '@/components/modals/EditGroupReportModal';
import CommonModal from '@/components/modals/CommonModal';
import reportService from '@/services/reportService';
import { IGroup, IReport } from '@/types';
import { formatVNDate } from '@/utils';

type Comment = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
};

const ReportTimeline = ({ group }: { group: IGroup }) => {
  const [reports, setReports] = useState<IReport[]>([]);

  const [addingReport, setAddingReport] = useState(false);
  const [editingReport, setEditingReport] = useState(false);
  const [deletingReport, setDeletingReport] = useState(false);
  const [newComment, setNewComment] = useState<string>('');
  const [editingComment, setEditingComment] = useState<{
    itemId: number;
    comment: Comment;
  } | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      const res = await reportService.getReports(group.groupId);
      if (res.data) {
        setReports(res.data.reverse());
      }
    };

    fetchReports();
  }, []);

  // const handleAddComment = (itemId: number) => {
  //   if (newComment.trim()) {
  //     const newCommentObj: Comment = {
  //       id: Date.now(),
  //       author: 'Admin',
  //       content: newComment,
  //       timestamp: new Date().toLocaleString(),
  //     };
  //     setTimelineItems((prev) =>
  //       prev.map((item) => (item.id === itemId ? { ...item, comments: [...item.comments, newCommentObj] } : item)),
  //     );
  //     setNewComment('');
  //   }
  // };

  // const handleEditComment = (itemId: number, updatedComment: Comment) => {
  //   setTimelineItems((prev) =>
  //     prev.map((item) =>
  //       item.id === itemId
  //         ? {
  //             ...item,
  //             comments: item.comments.map((c) => (c.id === updatedComment.id ? updatedComment : c)),
  //           }
  //         : item,
  //     ),
  //   );
  //   setEditingComment(null);
  // };

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
                        }}
                      />
                      <Trash
                        className="w-4 h-4 text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingReport(true);
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

        {/* <Dialog open={!!editingComment} onOpenChange={() => setEditingComment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa bình luận</DialogTitle>
            </DialogHeader>
            {editingComment && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const updatedComment: Comment = {
                    ...editingComment.comment,
                    content: formData.get('content') as string,
                  };
                  handleEditComment(editingComment.itemId, updatedComment);
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="content">Nội dung</Label>
                  <textarea
                    id="content"
                    name="content"
                    defaultValue={editingComment.comment.content}
                    className="w-full min-h-[100px] p-2 border rounded-md mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <Button type="submit" className="w-full text-white bg-blue-500 hover:bg-blue-600">
                  Cập nhật
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog> */}
      </Card>
      <AddGroupReportModal
        isOpen={addingReport}
        setIsOpen={setAddingReport}
        reports={reports}
        setReports={setReports}
        group={group}
      />
      <EditGroupReportModal isOpen={editingReport} setIsOpen={setEditingReport} />
      <CommonModal
        isOpen={deletingReport}
        setIsOpen={setDeletingReport}
        width={400}
        height={150}
        title="Bạn có muốn xoá mục này không?"
        acceptTitle="Xoá"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        // ocClickAccept={}
      />
    </>
  );
};

export default ReportTimeline;
