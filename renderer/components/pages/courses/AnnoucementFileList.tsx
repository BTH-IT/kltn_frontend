'use client';

import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { getFileType } from '@/utils';

import AnnouncementFileItem from './AnnouncementFileItem';

const AnnouncementFileList = ({
  files,
  setFiles,
}: {
  files: any[];
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const handleRemoveFile = (fileIndex: number) => {
    const updatedFiles = files.filter((_, index) => index !== fileIndex);
    setFiles(updatedFiles);
  };

  return files.length > 0 ? (
    <div className="flex flex-col gap-3 px-3 pt-3">
      {files.map((f, index) => (
        <div key={index} className="flex items-center border rounded-lg transition-all hover:bg-[#f0f0f0]">
          <AnnouncementFileItem f={f} />
          <div className="flex items-center justify-between flex-1 gap-3 pr-2">
            <div className="flex flex-col justify-around flex-1">
              <Link
                href={f instanceof File ? URL.createObjectURL(f) : f.url} // Use URL.createObjectURL for Blob/File, else use the URL
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primaryGray transition-all hover:text-[#0070f3] line-clamp-1"
              >
                {f.name}
              </Link>
              <p className="text-[#666] line-clamp-1 capitalize">{getFileType(f instanceof File ? f.type : f.type)}</p>
            </div>
            <Trash2 className="cursor-pointer" onClick={() => handleRemoveFile(index)} />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <></>
  );
};

export default AnnouncementFileList;
