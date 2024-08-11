import React from 'react';
import { ArrowLeft } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { YoutubeCardProps } from '@/components/common/YoutubeCard';
import { formatViewCount } from '@/utils';
import 'moment/locale/vi';

moment.locale('vi');

const YoutubeSelectForm = ({
  isQueryUrl,
  selectedVideo,
  setIsQueryUrl,
  setSelectedVideo,
  setIsQueryText,
}: {
  isQueryUrl: boolean;
  selectedVideo: YoutubeCardProps | null;
  setIsQueryUrl: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedVideo: React.Dispatch<React.SetStateAction<YoutubeCardProps | null>>;
  setIsQueryText: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleReturn = () => {
    if (isQueryUrl) {
      setIsQueryUrl(false);
    } else {
      setSelectedVideo(null);
      setIsQueryText(true);
    }
  };

  return (
    <div className={`${isQueryUrl || selectedVideo ? '' : 'hidden'} pt-5`}>
      <Button
        onClick={() => {
          handleReturn();
        }}
        variant="secondary3"
        className="flex gap-2 items-center"
      >
        <ArrowLeft width={20} height={20} />
        <span>Quay lại</span>
      </Button>
      <div className="flex overflow-hidden gap-3 mx-5 mt-6 rounded-lg border">
        <iframe
          height={340}
          width={640}
          src={`https://www.youtube.com/embed/${selectedVideo?.videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="flex-shrink-0"
        />
        <div className="overflow-y-auto overflow-x-hidden p-4 max-h-[340px] h-full">
          <div>
            <p className="mb-2 text-lg text-black line-clamp-2">{selectedVideo?.title}</p>
            <p className="mb-4 text-base text-black line-clamp-1">
              {formatViewCount(Number(selectedVideo?.viewCount))} lượt xem •{' '}
              {moment(selectedVideo?.publishedAt).fromNow()}
            </p>
            <div className="flex gap-2 items-center">
              <Image
                width={600}
                height={600}
                className="object-cover w-6 h-6 rounded-full"
                src={selectedVideo?.channelAvatar || ''}
                alt={selectedVideo?.channelTitle || ''}
              />
              <span className="text-gray-900 line-clamp-1">{selectedVideo?.channelTitle}</span>
            </div>
          </div>
          <p className="mt-2">{selectedVideo?.desc}</p>
        </div>
      </div>
    </div>
  );
};

export default YoutubeSelectForm;
