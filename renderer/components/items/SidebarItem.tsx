import React from 'react';
import Link from 'next/link';

import { Accordion, AccordionContent, AccordionItem, AccordionTriggerDropDown } from '@/components/ui/accordion';

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  href?: string; // Optional for links
  isActive?: boolean;
  children?: React.ReactNode;
  isDropdown?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  href = '',
  isActive,
  children,
  isDropdown = false,
}) => {
  const course = `w-fill tracking-wide py-2 pr-2 pl-6 flex items-center cursor-pointer  ${
    isActive ? 'bg-sky-100 rounded-r-full' : 'hover:bg-gray-100 rounded-r-full'
  }`;

  return (
    <>
      {isDropdown ? (
        <Accordion type="single" defaultValue="item-1" collapsible>
          <AccordionItem value="item-1">
            <AccordionTriggerDropDown>
              <li className={course}>
                <div className="flex flex-shrink-0 justify-center items-center w-9">{icon}</div>
                <span className={'ml-3 text-sm font-semibold text-gray-600 text-nowrap'}>{label}</span>
              </li>
            </AccordionTriggerDropDown>
            <AccordionContent>{children}</AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <li className={course}>
          <Link href={href} className="flex w-fill">
            <div className="flex flex-shrink-0 justify-center items-center w-9">{icon}</div>
            <span className={'ml-3 text-sm font-semibold text-gray-600 text-nowrap'}>{label}</span>
          </Link>
        </li>
      )}
    </>
  );
};
export default SidebarItem;
