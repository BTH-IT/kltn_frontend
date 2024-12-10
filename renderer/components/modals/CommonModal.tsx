'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SIZE_OPTIONS } from '@/types/modal-size';
import { logError } from '@/libs/utils';

const CommonModal = ({
  isOpen,
  setIsOpen,
  width,
  height,
  children = null,
  title,
  desc,
  acceptClassName,
  acceptTitle,
  ocClickAccept = () => {},
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  width: SIZE_OPTIONS;
  height: SIZE_OPTIONS;
  children?: React.ReactNode;
  title: string;
  desc?: React.ReactNode;
  acceptClassName?: string;
  acceptTitle?: string;
  ocClickAccept?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  /* 
  possible values for width and height class are:
  max-w-[50px] max-w-[100px] max-w-[150px] max-w-[200px] max-w-[250px] max-w-[300px] max-w-[400px] max-w-[500px] max-w-[600px] max-w-[700px] max-w-[800px] max-w-[900px] max-w-[1000px]
  max-h-[50px] max-h-[100px] max-h-[150px] max-h-[200px] max-h-[250px] max-h-[300px] max-h-[400px] max-h-[500px] max-h-[600px] max-h-[700px] max-h-[800px] max-h-[900px] max-h-[1000px]
  */
  const className = `max-w-[${width}px] max-h-[${height}px] transition-all`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={className}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>{desc}</div>
        <DialogFooter className="sm:items-end">
          <Button
            variant="ghost"
            onClick={async () => {
              try {
                setIsLoading(true);
                await ocClickAccept();
                toast.success('Thành công');
              } catch (error) {
                logError(error);
              } finally {
                setIsLoading(false);
              }
            }}
            className={`flex gap-3 items-center ${acceptClassName}`}
            disabled={isLoading}
          >
            {isLoading && (
              <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
            )}
            {acceptTitle ?? 'Chấp nhận'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommonModal;
