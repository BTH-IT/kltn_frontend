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
  fullName,
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
  fullName: string;
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

  const studentMentioned = students?.filter((student) => mentions?.includes(student.userId)) || [];

  return (
    <div
      className={`flex gap-5 text-primaryGray !py-3 ${className} ${
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

      <div className="flex flex-1 gap-3 items-center">
        {type === 'comment' && (
          <div className="flex flex-col flex-1 justify-around w-full">
            <div className="flex gap-3 items-center">
              <h2 className="text-sm font-semibold">{fullName}</h2>
              <p className="text-xs font-light">{moment(timestamp).fromNow()}</p>
            </div>
            {children}
          </div>
        )}

        {type === 'announcement' && (
          <div className="flex flex-col justify-start w-full">
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-semibold">{fullName}</h2>
              {mentions && mentions[0] !== 'all' && (
                <>
                  <Play size={10} fill="#242424" />
                  <div className="flex gap-1">
                    <Button
                      onClick={() => setIsMentionModalOpen(true)}
                      variant="link"
                      className="text-sm font-semibold p-0 h-fit"
                    >
                      {mentions.length} sinh viên
                    </Button>
                  </div>
                </>
              )}
            </div>
            <p className="text-xs font-light">{moment(timestamp).fromNow()}</p>
          </div>
        )}

        {(type === 'teacher' || type === 'student') && <h2 className="flex-1 text-sm font-semibold">{fullName}</h2>}

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
              <div key={item.userId} className="flex items-center gap-3 p-2">
                <Image
                  src={item.avatarUrl || '/images/avt.png'}
                  height={3000}
                  width={3000}
                  alt="avatar"
                  className="w-[35px] h-[35px] rounded-full"
                />
                <span className="line-clamp-1 font-sans font-medium">{item.name + ` (${item.email})`}</span>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

export default AvatarHeader;
