'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Clapperboard, CloudUpload, Paperclip } from 'lucide-react';

import { logError } from '@/libs/utils'; // Utility function for logging errors

const AnnouncementFileItem = ({ f }: { f: File | { url: string; name: string; type: string } }) => {
  const [fileType, setFileType] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFileType = async () => {
      if (f instanceof File) {
        try {
          if (f.size < 10000000) {
            setFileType(f.type || 'unknown');
          } else {
            setFileType('large');
          }
        } catch (error) {
          logError(error);
          setFileType('unknown');
        }
      } else {
        // If it's a URL, assume it's already a known file type
        setFileType(f.type || 'unknown');
      }
      setIsLoading(false);
    };

    fetchFileType();
  }, [f]);

  if (isLoading) return <div className="text-xs">Loading...</div>;

  if (f instanceof File) {
    // If it's a File object
    return (
      <div className="mr-2 max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full flex justify-center items-center border-r overflow-hidden">
        {fileType.includes('image/') && (
          <Image
            src={URL.createObjectURL(f)}
            width={800}
            height={800}
            className="object-contain max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full"
            alt={f.name}
          />
        )}
        {(fileType.includes('text/') || fileType.includes('application/')) && <Paperclip width={36} height={36} />}
        {fileType.includes('video/') && <Clapperboard width={36} height={36} />}
        {fileType === 'unknown' && <CloudUpload width={36} height={36} />}
        {fileType === 'large' && <div className="text-xs text-center">File too large</div>}
      </div>
    );
  }

  // If it's a URL object (e.g., file from an external server)
  return (
    <div className="mr-2 max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full flex justify-center items-center border-r overflow-hidden">
      {fileType.includes('image/') ? (
        <Image
          src={f.url}
          width={800}
          height={800}
          className="object-contain max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full"
          alt={f.name}
        />
      ) : fileType.includes('application/pdf') ? (
        <Paperclip width={36} height={36} />
      ) : fileType.includes('video/') ? (
        <Clapperboard width={36} height={36} />
      ) : (
        <CloudUpload width={36} height={36} />
      )}
    </div>
  );
};

export default AnnouncementFileItem;
