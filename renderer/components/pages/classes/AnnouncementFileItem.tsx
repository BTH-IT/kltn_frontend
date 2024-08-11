import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import FileType from 'file-type/browser';
import { Clapperboard, CloudUpload, Paperclip } from 'lucide-react';

const AnnouncementFileItem = ({ f }: { f: File }) => {
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    const fetchFileType = async () => {
      const res = await FileType.fromBlob(f);
      setFileType(f.type || res?.mime || 'unknown');
    };

    fetchFileType();
  }, [f]);

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
    </div>
  );
};

export default AnnouncementFileItem;
