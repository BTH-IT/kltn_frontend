'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { settingList } from '@/constants/common';

const SettingHeader = () => {
  const searchParams = useSearchParams().toString();

  return (
    <>
      <div className="sticky top-0 right-0 bg-white z-10 border-t-[1px] flex gap-3 justify-between items-center px-6 border-b">
        <div className="flex items-center">
          {settingList.map((setting, idx) => (
            <Link
              key={idx}
              href={`/settings?${setting.param}`}
              className={`${
                searchParams === setting.param || (idx === 0 && searchParams === '')
                  ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
                  : ''
              } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
            >
              {setting.title}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SettingHeader;
