// components/UploadComponent.tsx
'use client';

import React, { useRef } from 'react';

import Image from 'next/image';
import { Upload, LucideImage, X } from 'lucide-react'; // Assuming these icons are from lucide-react
import { Button } from '../ui/button';

const UploadComponent = ({
  onUpload,
  setFile,
  selectedImageUrl,
}: {
  onUpload: (url: string) => void;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  selectedImageUrl: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSelectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mt-5">
      <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
      {selectedImageUrl ? (
        <div className="relative group">
          <Image
            src={selectedImageUrl}
            alt="Cover image"
            width={750}
            height={185}
            className="rounded-lg object-cover max-h-[250px]"
          />
          <X
            className="w-[34px] h-[34px] rounded-full p-2 absolute opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300  bg-red-100 text-red-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setFile(null)}
          />
        </div>
      ) : (
        <Image
          src="https://gstatic.com/classroom/themes/img_backtoschool.jpg"
          alt="Cover image"
          width={750}
          height={185}
          className="rounded-lg max-h-[250px] object-cover"
        />
      )}
      <div className="flex justify-between items-center mt-10 h-fit">
        <div className="font-medium">Chọn hình ảnh tiêu đề cho bảng tin</div>
        <div className="flex gap-4">
          <Button variant="primaryReverge" className="w-[135px]" onClick={handleSelectImage}>
            <Upload />
            <span className="pl-2">Tải ảnh lên</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadComponent;
