/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import '@/styles/components/modals/add-youtube-link-modal.scss';

import { Dialog, DialogClose, DialogContent2, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import YoutubeSearchForm from '@/components/forms/YoutubeSearchForm';
import { cn } from '@/libs/utils';
import { YoutubeCardProps } from '@/components/common/YoutubeCard';

import YoutubeSelectListForm from '../forms/YoutubeSelectListForm';
import YoutubeSelectForm from '../forms/YoutubeSelectForm';
import Button from '../common/Button';

const AddYoutubeLinkModal = ({
  isOpen,
  setIsOpen,
  handleAddYoutubeLink,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddYoutubeLink: (selectedVideo: YoutubeCardProps | null) => void;
}) => {
  const [selectedVideo, setSelectedVideo] = useState<YoutubeCardProps | null>(null);
  const [searchData, setSearchData] = useState<YoutubeCardProps[]>([]);
  const [isQueryUrl, setIsQueryUrl] = useState(false);
  const [isQueryText, setIsQueryText] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetState = () => {
    setIsQueryUrl(false);
    setIsQueryText(false);
    setIsLoading(false);
    setSearchData([]);
    setSelectedVideo(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        if (!isOpen) {
          resetState();
        }
      }}
    >
      <DialogContent2
        className="flex flex-col !z-50 max-w-[1200px] h-[620px] w-full gap-0 duration-0 transition-all p-0 text-gray-700 overflow-x-hidden font-sans"
        classOverlay="!z-50"
      >
        <DialogHeader className="fixed w-full h-fit justify-between items-center !flex-row border-b-2 px-6 py-4">
          <DialogTitle className="flex items-center">
            <Image width={100} height={80} src="/images/youtube-logo-png.png" alt="Youtube Lolo" />
          </DialogTitle>
          <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="w-6 h-6 font-bold" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className={cn('loader absolute top-0 w-full h-1 rounded-3xl', !isLoading && 'hidden')} />
        <div className="mt-[90px]"></div>
        <YoutubeSearchForm
          isQueryUrl={isQueryUrl}
          isQueryText={isQueryText}
          setIsQueryUrl={setIsQueryUrl}
          setIsQueryText={setIsQueryText}
          setSearchData={setSearchData}
          setIsLoading={setIsLoading}
          setSelectedVideo={setSelectedVideo}
        />
        <YoutubeSelectListForm
          setIsQueryUrl={setIsQueryUrl}
          searchData={searchData}
          setSelectedVideo={setSelectedVideo}
          isLoading={isLoading}
          isQueryText={isQueryText}
          selectedVideo={selectedVideo}
        />
        <YoutubeSelectForm
          isQueryUrl={isQueryUrl}
          selectedVideo={selectedVideo}
          setIsQueryUrl={setIsQueryUrl}
          setSelectedVideo={setSelectedVideo}
          setIsQueryText={setIsQueryText}
        />
        {(isQueryUrl || selectedVideo) && (
          <DialogFooter className="p-5 mt-auto">
            <Button
              buttonType="primary"
              className="px-5 py-3 text-white bg-blue-500 hover:text-blue-500"
              onClick={() => handleAddYoutubeLink(selectedVideo)}
            >
              Thêm video
            </Button>
          </DialogFooter>
        )}
      </DialogContent2>
    </Dialog>
  );
};

export default AddYoutubeLinkModal;
