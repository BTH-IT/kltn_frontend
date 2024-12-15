import React from 'react';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

import { MetaLinkData } from '@/types';
import { MediaModal } from '@/components/modals/MediaModal';

const AnnouncementLinkList = ({
  links,
  setLinks,
}: {
  links: MetaLinkData[];
  setLinks: React.Dispatch<React.SetStateAction<MetaLinkData[]>>;
}) => {
  const handleRemoveLink = (fileIndex: number) => {
    const updatedLinks = links.filter((_, index) => index !== fileIndex);
    setLinks(updatedLinks);
  };

  return links.length > 0 ? (
    <div className="flex flex-col gap-3 px-3 pt-3">
      {links.map((link, index) => (
        <div key={index} className="flex items-center border rounded-lg transition-all hover:bg-[#f0f0f0]">
          <div className="mr-2 max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full flex justify-center items-center border-r overflow-hidden">
            <MediaModal
              imgSrc={link.image}
              className="object-contain max-w-[80px] max-h-[70px] min-w-[80px] min-h-[70px] w-full h-full"
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
            <Trash2 className="cursor-pointer" onClick={() => handleRemoveLink(index)} />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <></>
  );
};

export default AnnouncementLinkList;
