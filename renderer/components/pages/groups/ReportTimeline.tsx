'use client';

import { useState } from 'react';
import { MessageSquare, Plus, Edit, Trash, Image, Link as LinkIcon, Paperclip, MoreVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Comment = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
};

type TimelineItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  comments: Comment[];
};

export default function ReportTimeline() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    {
      id: 1,
      title: 'Khởi động dự án',
      description:
        'Bắt đầu dự án với việc lập kế hoạch và phân công nhiệm vụ. Chúng ta đã xác định được các mục tiêu chính và timeline dự kiến cho từng giai đoạn.',
      date: '2023-06-01',
      comments: [
        {
          id: 1,
          author: 'Alice',
          content: 'Rất hào hứng với dự án này!',
          timestamp: '2023-06-01 14:30',
        },
      ],
    },
    {
      id: 2,
      title: 'Hoàn thành giai đoạn 1',
      description:
        'Đã hoàn thành việc phát triển các tính năng cơ bản của ứng dụng. Giao diện người dùng đã được thiết kế và các chức năng chính đã được triển khai.',
      date: '2023-07-15',
      comments: [
        {
          id: 2,
          author: 'Bob',
          content: 'Tuyệt vời! Chúng ta đã đạt được nhiều hơn dự kiến.',
          timestamp: '2023-07-15 18:00',
        },
      ],
    },
  ]);

  const [newComment, setNewComment] = useState<string>('');
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [editingComment, setEditingComment] = useState<{
    itemId: number;
    comment: Comment;
  } | null>(null);

  const handleAddComment = (itemId: number) => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now(),
        author: 'Admin',
        content: newComment,
        timestamp: new Date().toLocaleString(),
      };
      setTimelineItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, comments: [...item.comments, newCommentObj] } : item)),
      );
      setNewComment('');
    }
  };

  const handleEditComment = (itemId: number, updatedComment: Comment) => {
    setTimelineItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              comments: item.comments.map((c) => (c.id === updatedComment.id ? updatedComment : c)),
            }
          : item,
      ),
    );
    setEditingComment(null);
  };

  const handleDeleteComment = (itemId: number, commentId: number) => {
    setTimelineItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              comments: item.comments.filter((c) => c.id !== commentId),
            }
          : item,
      ),
    );
  };

  const handleAddTimelineItem = () => {
    const newItem: TimelineItem = {
      id: Date.now(),
      title: 'Mục mới',
      description: 'Mô tả cho mục mới',
      date: new Date().toISOString().split('T')[0],
      comments: [],
    };
    setTimelineItems((prev) => [...prev, newItem]);
    setEditingItem(newItem);
  };

  const handleEditTimelineItem = (item: TimelineItem) => {
    setEditingItem(item);
  };

  const handleDeleteTimelineItem = (id: number) => {
    setTimelineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveTimelineItem = (updatedItem: TimelineItem) => {
    setTimelineItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    setEditingItem(null);
  };

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50">
        <CardTitle className="text-2xl font-bold text-gray-800">Báo cáo dự án</CardTitle>
        <Button onClick={handleAddTimelineItem} className="text-white bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Thêm mục mới
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="multiple" defaultValue={timelineItems.map((item) => item.id.toString())} className="w-full">
          {timelineItems.map((item) => (
            <AccordionItem key={item.id} value={item.id.toString()} className="pr-4 border-b last:border-b-0">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white bg-blue-500 rounded-full">
                      {item.id}
                    </div>
                    <div className="flex flex-col items-start justify-start">
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTimelineItem(item);
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTimelineItem(item.id);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-6 py-4">
                  <div className="pl-6 border-l-2 border-blue-200">
                    <div
                      className="mb-4 prose text-gray-700 max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                    <div className="space-y-4">
                      {item.comments.map((comment) => (
                        <div key={comment.id} className="p-4 rounded-lg shadow-sm bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback>{comment.author[0]}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-gray-700">{comment.author}</span>
                              <span className="text-sm text-gray-500">{comment.timestamp}</span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    setEditingComment({
                                      itemId: item.id,
                                      comment,
                                    })
                                  }
                                >
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteComment(item.id, comment.id)}>
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-gray-600">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <textarea
                        placeholder="Thêm bình luận..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full min-h-[100px] p-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Button
                        onClick={() => handleAddComment(item.id)}
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

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Chỉnh sửa mục' : 'Thêm mục mới'}</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedItem: TimelineItem = {
                  ...editingItem,
                  title: formData.get('title') as string,
                  date: formData.get('date') as string,
                  description: formData.get('description') as string,
                };
                handleSaveTimelineItem(updatedItem);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="title">Tiêu đề</Label>
                <Input id="title" name="title" defaultValue={editingItem.title} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="date">Ngày</Label>
                <Input id="date" name="date" type="date" defaultValue={editingItem.date} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <div className="p-2 mt-1 border rounded-md">
                  <div className="flex mb-2 space-x-2">
                    <Button type="button" variant="outline" size="sm">
                      <Image className="w-4 h-4 mr-1" />
                      Ảnh
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      <LinkIcon className="w-4 h-4 mr-1" />
                      Liên kết
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      <Paperclip className="w-4 h-4 mr-1" />
                      Tệp
                    </Button>
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={editingItem.description}
                    className="w-full min-h-[200px] p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full text-white bg-blue-500 hover:bg-blue-600">
                Lưu
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingComment} onOpenChange={() => setEditingComment(null)}>
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
      </Dialog>
    </Card>
  );
}
