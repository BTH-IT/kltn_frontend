'use client';

import { useUser } from '@clerk/nextjs';
import { useQRCode } from 'next-qrcode';
import { Copy, EllipsisVertical, EyeOff, Link2, QrCode, RotateCcw, Scan } from 'lucide-react';
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
import classService from '@/services/classService';
import CommonModal from '@/components/modals/CommonModal';

const InviteCode = ({ teacherId, inviteCode, name }: { teacherId: string; inviteCode: string; name: string }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const { Canvas } = useQRCode();

  const [code, setCode] = useState(inviteCode);
  const [updatingInvCode, setUpdatingInvCode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setCode(inviteCode);
  }, [inviteCode]);

  const handleChangeInvCodeClick = async () => {
    setUpdatingInvCode(true);
    try {
      const res = await classService.updateClassInviteCode(inviteCode);
      if (res.data) {
        setCode(res.data.inviteCode);
        toast({
          title: `Mã lớp đã được đặt lại thành ${res.data.inviteCode}`,
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

  const handleCopyInvCodeClick = async () => {
    try {
      const classCode = inviteCode;
      await navigator.clipboard.writeText(classCode);
      toast({
        title: 'Đã sao chép mã lớp',
        variant: 'done',
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCopyInvLinkClick = async () => {
    try {
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/classes/invite/${inviteCode}`);
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
    <div className="p-4 rounded-md border">
      <div className="flex gap-3 justify-between items-center mb-3">
        <h2>Mã lớp</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex gap-3 items-center">
                <EyeOff width={20} height={20} />
                <span>Ẩn mã lớp</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeInvCodeClick()} className="flex gap-3 items-center">
                <RotateCcw width={20} height={20} />
                <span>Đặt lại mã lớp</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)} className="flex gap-3 items-center">
                <QrCode width={20} height={20} />
                <span>QR tham gia lớp học</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopyInvCodeClick()} className="flex gap-3 items-center">
                <Copy width={20} height={20} />
                <span>Sao chép mã lớp</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopyInvLinkClick()} className="flex gap-3 items-center">
                <Link2 width={20} height={20} />
                <span>Sao chép liên kết tham gia lớp học</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-5 items-center">
        <p className={cn('text-2xl font-semibold', updatingInvCode && 'hidden')}>{inviteCode}</p>
        <Skeleton className={cn('h-10 w-[88px]', !updatingInvCode && 'hidden')} />
        <ShowCodeModal invCode={code} classesName={name}>
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
          <div className="w-fit mx-auto mt-5">
            <Canvas
              text={`${process.env.NEXT_PUBLIC_URL}/classes/invite/${inviteCode}`}
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
        ocClickAccept={handleCopyInvLinkClick}
      />
    </div>
  ) : (
    <></>
  );
};

export default InviteCode;
