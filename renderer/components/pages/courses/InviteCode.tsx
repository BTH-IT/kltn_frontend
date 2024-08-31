'use client';

import { useQRCode } from 'next-qrcode';
import { Copy, EllipsisVertical, Link2, QrCode, RotateCcw, Scan } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import ShowCodeModal from '@/components/modals/ShowCodeModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/libs/utils';
import CommonModal from '@/components/modals/CommonModal';
import courseService from '@/services/courseService';
import { ICourse, IUser } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';

const InviteCode = ({ teacherId, course, name }: { teacherId: string; course: ICourse | null; name: string }) => {
  const { toast } = useToast();
  const { Canvas } = useQRCode();

  const [user, setUser] = useState<IUser | null>(null);
  const [code, setCode] = useState(course?.inviteCode || '');
  const [updatingInvCode, setUpdatingInvCode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setCode(course?.inviteCode || '');
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}') as IUser;
      setUser(user);
    }
  }, [course?.inviteCode]);

  const handleChangeInvCode = async () => {
    setUpdatingInvCode(true);
    try {
      const res = await courseService.updateCourseInviteCode(course?.courseId || '');
      if (res.data) {
        setCode(res.data);
        toast({
          title: `Mã lớp đã được đặt lại thành ${res.data}`,
          variant: 'done',
          duration: 2000,
        });
      }
    } catch (err) {
      console.error('Failed to change invite code: ', err);
    } finally {
      setUpdatingInvCode(false);
    }
  };

  const handleCopyInvCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: 'Đã sao chép mã lớp',
        variant: 'done',
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCopyInvLink = async () => {
    try {
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/courses/invite/${code}`);
      toast({
        title: 'Đã sao chép link mời tham gia lớp',
        variant: 'done',
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return teacherId === user?.id ? (
    <div className="p-4 border rounded-md">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2>Mã lớp</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleChangeInvCode()} className="flex items-center gap-3">
                <RotateCcw width={20} height={20} />
                <span>Đặt lại mã lớp</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)} className="flex items-center gap-3">
                <QrCode width={20} height={20} />
                <span>QR tham gia lớp học</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopyInvCode()} className="flex items-center gap-3">
                <Copy width={20} height={20} />
                <span>Sao chép mã lớp</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopyInvLink()} className="flex items-center gap-3">
                <Link2 width={20} height={20} />
                <span>Sao chép liên kết tham gia lớp học</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-5">
        <p className={cn('text-2xl font-semibold', updatingInvCode && 'hidden')}>{code}</p>
        <Skeleton className={cn('h-10 w-[88px]', !updatingInvCode && 'hidden')} />
        <ShowCodeModal invCode={code} courseName={name}>
          <Scan className="cursor-pointer" />
        </ShowCodeModal>
      </div>
      <CommonModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        width={600}
        height={600}
        title="QR tham gia lớp học"
        desc={
          <div className="mx-auto mt-5 w-fit">
            <Canvas
              text={`${process.env.NEXT_PUBLIC_URL}/courses/invite/${code}`}
              options={{
                errorCorrectionLevel: 'M',
                margin: 3,
                scale: 4,
                width: 350,
                color: {
                  dark: '#000000',
                  light: '#FFFFFF',
                },
              }}
            />
          </div>
        }
        acceptTitle="Sao chép link tham gia lớp học"
        acceptClassName="mx-auto bg-blue-400 text-primary-foreground hover:bg-blue-500 hover:shadow-lg"
        ocClickAccept={handleCopyInvLink}
      />
    </div>
  ) : (
    <></>
  );
};

export default InviteCode;
