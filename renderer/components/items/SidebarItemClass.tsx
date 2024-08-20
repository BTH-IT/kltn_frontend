import Link from 'next/link';
import React from 'react';

interface SidebarItemClassProps {
  label: string;
  subLabel?: string;
  href: string;
  isActive?: boolean;
}

const SidebarItemClass: React.FC<SidebarItemClassProps> = ({ label, subLabel, href, isActive }) => {
  const course = `w-fill tracking-wide py-2 pr-2 pl-6 flex items-center cursor-pointer  ${
    isActive ? 'bg-sky-100 rounded-r-full' : 'hover:bg-gray-100 rounded-r-full'
  }`;

  // create logo base on first letter of label
  const icon = (
    <div className="flex justify-center items-center w-8 h-8 text-sm font-medium text-white uppercase bg-blue-500 rounded-full">
      {label ? label[0] : 'A'}
    </div>
  );

  return (
    <>
      <li className={course}>
        <Link className="flex gap-3 w-fill" href={href}>
          <div className="flex flex-shrink-0 justify-center items-center w-9">{icon}</div>
          <div
            className={'flex overflow-hidden flex-col flex-1 justify-center items-start self-center w-32 h-10 text-sm'}
          >
            <div className="text-sm font-semibold text-gray-600 line-clamp-1">{label}</div>
            {subLabel ? <div className="text-xs font-thin">{subLabel}</div> : <></>}
          </div>
        </Link>
      </li>
    </>
  );
};
export default SidebarItemClass;
