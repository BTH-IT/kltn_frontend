import { Play } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React, { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import CommonModal from '@/components/modals/CommonModal';
import { IUser } from '@/types';
import 'moment/locale/vi';

moment.locale('vi');

const AvatarHeader = ({
  imageUrl,
  name,
  timestamp,
  mentions,
  students,
  type = 'announcement',
  children,
  dropdownMenu,
  className = '',
  showCheckbox = true,
  checked = false,
  onCheckedChange,
}: {
  imageUrl: string;
  name: string;
  timestamp?: string;
  mentions?: string[];
  students?: IUser[];
  type?: string;
  children?: React.ReactNode;
  dropdownMenu?: React.ReactNode;
  className?: string;
  showCheckbox?: boolean;
  checked?: boolean;
  onCheckedChange?: () => void;
}) => {
  const [isMentionModalOpen, setIsMentionModalOpen] = useState(false);

  const studentMentioned = students?.filter((student) => mentions?.includes(student.id)) || [];

  return (
    <div
      className={`flex gap-5 text-primaryGray ${className} ${
        type === 'teacher' || type === 'student' ? 'border-b pb-3 items-center' : 'items-start'
      }`}
    >
      {type === 'student' && showCheckbox && (
        <Checkbox id="terms" checked={checked} onCheckedChange={onCheckedChange} />
      )}

      <Image
        src={imageUrl || '/images/avt.png'}
        height={3000}
        width={3000}
        alt="avatar"
        className="w-[35px] h-[35px] rounded-full"
      />

      <div className="flex items-center flex-1 gap-3">
        {type === 'comment' && (
          <div className="flex flex-col justify-around flex-1 w-full">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold">{name}</h2>
              <p className="text-xs font-light">
                {moment(moment()).diff(moment(timestamp), 'days') > 5
                  ? moment(timestamp).format('DD/MM/YYYY')
                  : moment(timestamp).fromNow()}
              </p>
            </div>
            {children}
          </div>
        )}

        {type === 'announcement' && (
          <div className="flex flex-col justify-start w-full">
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-semibold">{name}</h2>
              {mentions && mentions.length > 0 && (
                <>
                  <Play size={10} fill="#242424" />
                  <div className="flex gap-1">
                    <Button
                      onClick={() => setIsMentionModalOpen(true)}
                      variant="link"
                      className="p-0 text-sm font-semibold h-fit"
                    >
                      {mentions.length} sinh viên
                    </Button>
                  </div>
                </>
              )}
            </div>
            <p className="text-xs font-light">
              {moment(moment()).diff(moment(timestamp), 'days') > 5
                ? moment(timestamp).format('DD/MM/YYYY')
                : moment(timestamp).fromNow()}
            </p>
          </div>
        )}

        {(type === 'teacher' || type === 'student') && <h2 className="flex-1 text-sm font-semibold">{name}</h2>}

        {dropdownMenu}
      </div>
      <CommonModal
        width={500}
        height={400}
        isOpen={isMentionModalOpen}
        setIsOpen={setIsMentionModalOpen}
        title={`${mentions?.length} sinh viên`}
        acceptClassName="hidden"
        desc={
          <div className="overflow-y-auto max-h-[250px]">
            {studentMentioned.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2">
                <Image
                  src={item.avatar || '/images/avt.png'}
                  height={3000}
                  width={3000}
                  alt="avatar"
                  className="w-[35px] h-[35px] rounded-full"
                />
                <span className="font-sans font-medium line-clamp-1">
                  {item.fullName || item.userName + ` (${item.email})`}
                </span>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

export default AvatarHeader;
