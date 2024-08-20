'use client';

import React, { useState } from 'react';
import { Copy, Scan } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/libs/utils';

const ShowCodeModal = ({
  children,
  invCode,
  courseName,
}: {
  children: React.ReactNode;
  invCode: string;
  courseName: string;
}) => {
  const { toast } = useToast();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleCopyInvCodeClick = async () => {
    try {
      await navigator.clipboard.writeText(invCode);
      toast({
        title: 'Đã sao chép mã lớp',
        variant: 'done',
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          'h-[290px] gap-0 duration-0 transition-all',
          isFullScreen ? 'w-screen h-screen' : 'sm:max-w-[600px]',
        )}
      >
        <DialogHeader></DialogHeader>
        <div
          className={cn(
            'flex justify-center items-center text-8xl font-bold text-blue-600 mt-4 p-12 border-b-2 border-blue-600',
            isFullScreen && 'text-[20vw]',
          )}
        >
          {invCode}
        </div>
        <div className="flex items-center justify-between text-blue-600">
          <div className="font-medium">{courseName}</div>
          <div className="flex items-center justify-between">
            <Button
              onClick={() => handleCopyInvCodeClick()}
              variant="ghost"
              className="flex items-center gap-2 cursor-pointer hover:bg-blue-100/30"
            >
              <Copy width={15} height={15} />
              <span className="text-md">Sao chép mã lớp</span>
            </Button>
            <Button
              onClick={() => setIsFullScreen(!isFullScreen)}
              variant="ghost"
              className="flex items-center h-[52px] cursor-pointer rounded-full hover:bg-blue-100/30"
            >
              <Scan width={20} height={20} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowCodeModal;
