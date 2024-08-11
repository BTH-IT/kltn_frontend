import Image from 'next/image';
import React from 'react';
import moment from 'moment';

import { formatDuration, formatViewCount } from '@/utils';
import 'moment/locale/vi';

moment.locale('vi');

export interface YoutubeCardProps {
  nextPageToken?: string;
  videoId: string;
  channelAvatar: string;
  channelTitle: string;
  title: string;
  desc: string;
  publishedAt: string;
  thumbnail: string;
  viewCount: string;
  duration: string;
}

interface YoutubeCardSetProps extends YoutubeCardProps {
  setSelectedVideo: React.Dispatch<React.SetStateAction<YoutubeCardProps | null>>;
}

const YoutubeCard: React.FC<YoutubeCardSetProps> = ({
  channelAvatar,
  channelTitle,
  title,
  desc,
  publishedAt,
  thumbnail,
  viewCount,
  duration,
  videoId,
  setSelectedVideo,
}) => {
  const handleClick = () => {
    setSelectedVideo({
      channelAvatar,
      channelTitle,
      title,
      desc,
      publishedAt,
      thumbnail,
      viewCount,
      duration,
      videoId,
    });
  };

  return (
    <div
      onClick={() => {
        handleClick();
      }}
      className="overflow-hidden col-span-12 mx-auto bg-white rounded-lg shadow-lg cursor-pointer sm:col-span-6 md:col-span-3"
    >
      <div className="relative w-full h-[150px]">
        <Image width={600} height={600} className="w-full h-[150px] object-cover" src={thumbnail} alt={title} />
        <div className="absolute right-0 bottom-0 px-2 py-1 text-xs text-white bg-black">
          {formatDuration(duration)}
        </div>
      </div>
      <div className="p-4 h-full">
        <p className="mb-2 text-lg text-black line-clamp-2">{title}</p>
        <p className="mb-4 text-base text-black line-clamp-1">
          {formatViewCount(Number(viewCount))} lượt xem • {moment(publishedAt).fromNow()}
        </p>
        <div className="flex gap-2 items-center">
          <Image
            width={600}
            height={600}
            className="object-cover w-6 h-6 rounded-full"
            src={channelAvatar}
            alt={channelTitle}
          />
          <span className="text-gray-900 line-clamp-1">{channelTitle}</span>
        </div>
      </div>
    </div>
  );
};

export default YoutubeCard;
