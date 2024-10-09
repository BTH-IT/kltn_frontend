/* eslint-disable no-unused-vars */
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Clapperboard, CloudUpload, Paperclip, Trash2 } from 'lucide-react';

import { getFileType } from '@/utils';
import { cn } from '@/libs/utils';
import { Attachment } from '@/types';

const AnnouncementAttachList = ({
  links,
  files,
  setLinks = () => {},
  setFiles = () => {},
  isEdit = false,
}: {
  links: Attachment[];
  files: Attachment[];
  setLinks?: React.Dispatch<React.SetStateAction<Attachment[]>>;
  setFiles?: React.Dispatch<React.SetStateAction<Attachment[]>>;
  isEdit?: boolean;
}) => {
  const handleRemoveLink = (link: any) => {
    const newLinks = links.filter((l) => l !== link);
    setLinks(newLinks);
  };
  const handleRemoveFile = (f: any) => {
    const newFiles = files.filter((file) => file !== f);
    setFiles(newFiles);
  };

  return (
    <div className={cn('grid grid-cols-12 gap-3', isEdit && 'px-3')}>
      {!isEdit ? (
        <>
          {links.map((link: any, index: any) => (
            <div
              key={index}
              className="flex items-center border rounded-lg transition-all hover:bg-[#f0f0f0] col-span-6 overflow-hidden px-2"
            >
              <div className="mr-2 max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full flex justify-center items-center border-r overflow-hidden">
                <Image
                  src={link.image}
                  width={800}
                  height={800}
                  className="object-contain max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full"
                  alt={link.title}
                />
              </div>
              <div className="flex items-center justify-between flex-1 gap-3 pr-2">
                <div className="flex flex-col justify-around flex-1">
                  <Link
                    href={link.url}
                    target="_blank"
                    className="font-semibold text-primaryGray transition-all hover:text-[#0070f3] line-clamp-1"
                  >
                    {link.title}
                  </Link>
                  <p className="text-[#666] line-clamp-1 truncate">{link.url?.slice(0, 30)}...</p>
                </div>
              </div>
            </div>
          ))}
          {files.map((f: any, index: any) => (
            <div
              key={index}
              className="flex items-center border rounded-lg transition-all hover:bg-[#f0f0f0] col-span-6 overflow-hidden px-2"
            >
              <div className="mr-2 max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full flex justify-center items-center border-r overflow-hidden">
                {f.type.includes('image/') && (
                  <Image
                    src={f instanceof File ? URL.createObjectURL(f) : f.url}
                    width={800}
                    height={800}
                    className="object-contain max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full"
                    alt={f.name}
                  />
                )}
                {(f.type.includes('text/') || f.type.includes('application/')) && <Paperclip width={36} height={36} />}
                {f.type.includes('video/') && <Clapperboard width={36} height={36} />}
                {f.type === 'unknown' && <CloudUpload width={36} height={36} />}
              </div>
              <div className="flex items-center justify-between flex-1 gap-3 pr-2">
                <div className="flex flex-col justify-around flex-1">
                  <Link
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primaryGray transition-all hover:text-[#0070f3] line-clamp-1"
                  >
                    {f.name}
                  </Link>
                  <p className="text-[#666] line-clamp-1 capitalize">{getFileType(f.type)}</p>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          {links.map((link: any, index: any) => (
            <div
              key={index}
              className="flex items-center border rounded-lg transition-all hover:bg-[#f0f0f0] col-span-12"
            >
              <div className="mr-2 max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full flex justify-center items-center border-r overflow-hidden">
                <Image
                  src={link.image}
                  width={800}
                  height={800}
                  className="object-contain max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full"
                  alt={link.title}
                />
              </div>
              <div className="flex items-center justify-between flex-1 gap-3 pr-2">
                <div className="flex flex-col justify-around flex-1">
                  <Link
                    href={link.url}
                    target="_blank"
                    className="font-semibold text-primaryGray transition-all hover:text-[#0070f3] line-clamp-1"
                  >
                    {link.title}
                  </Link>
                  <p className="text-[#666] line-clamp-1 truncate">{link.url?.slice(0, 30)}...</p>
                </div>
              </div>
              <div className="mr-2">
                <Trash2
                  className="cursor-pointer"
                  onClick={() => {
                    handleRemoveLink(link);
                  }}
                />
              </div>
            </div>
          ))}
          {files.map((f: any, index: any) => (
            <div
              key={index}
              className="flex items-center border rounded-lg transition-all hover:bg-[#f0f0f0] col-span-12"
            >
              <div className="mr-2 max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full flex justify-center items-center border-r overflow-hidden">
                {f.type.includes('image/') && (
                  <Image
                    src={f instanceof File ? URL.createObjectURL(f) : f.url}
                    width={800}
                    height={800}
                    className="object-contain max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full"
                    alt={f.name}
                  />
                )}
                {(f.type.includes('text/') || f.type.includes('application/')) && <Paperclip width={36} height={36} />}
                {f.type.includes('video/') && <Clapperboard width={36} height={36} />}
                {f.type === 'unknown' && <CloudUpload width={36} height={36} />}
              </div>
              <div className="flex items-center justify-between flex-1 gap-3 pr-2">
                <div className="flex flex-col justify-around flex-1">
                  <Link
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primaryGray transition-all hover:text-[#0070f3] line-clamp-1"
                  >
                    {f.name}
                  </Link>
                  <p className="text-[#666] line-clamp-1 capitalize">{getFileType(f.type)}</p>
                </div>
              </div>
              <div className="mr-2">
                <Trash2
                  className="cursor-pointer"
                  onClick={() => {
                    handleRemoveFile(f);
                  }}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AnnouncementAttachList;
