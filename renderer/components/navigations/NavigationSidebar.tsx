'use client';

import React, { useContext, useEffect, useState } from 'react';
import '@/styles/components/navigation/nav-sidebar.scss';
import { House, Calendar, GraduationCap, Import, Settings, Users, FolderMinus, NotebookPen } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import { API_URL } from '@/constants/endpoints';
import { SidebarContext } from '@/contexts/SidebarContext';
import { CoursesContext } from '@/contexts/CoursesContext';

import SidebarItem from '../items/SidebarItem';
import SidebarItemClass from '../items/SidebarItemClass';
import Loading from '../loading/loading';

const NavigationSidebar = () => {
  const { isShow } = useContext(SidebarContext);

  const pathname = usePathname();
  const { enrolledCourses, createdCourses, isLoading } = useContext(CoursesContext);

  const path = pathname?.slice(1, pathname.length - 1);

  const [isMounted, setIsMounted] = useState(false);
  // const [userData, setUserData] = useState<IUser | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // setUserData(JSON.parse(localStorage.getItem('user') || ''));
  }, []);

  return (
    isMounted && (
      <nav
        className={`sidebarbg-white border-gray-300 overflow-x-hidden border-r-[0.5px] py-3 max-w-[250px] h-[calc(100vh-70px)] overflow-y-auto transition-all duration-500 mt-[70px] ${
          !isShow ? 'w-[70px]' : 'w-[250px]'
        }`}
      >
        <ul>
          <SidebarItem label="Màn hình chính" icon={<House size={20} />} href="/" isActive={path === ''} />
          <SidebarItem label="Lịch" icon={<Calendar size={20} />} href="/calendar" isActive={path === 'calendar'} />
          <Separator className="my-2" />
          {!isLoading ? (
            <>
              {createdCourses && createdCourses.length > 0 && (
                <>
                  <SidebarItem label="Giảng dạy" icon={<Users size={20} />} isDropdown={true}>
                    <SidebarItem
                      label="Cần xem xét"
                      icon={<FolderMinus size={20} />}
                      href="/not-reviewed"
                      isActive={path === 'not-reviewed'}
                    />
                    {createdCourses.map((item) => (
                      <SidebarItemClass
                        key={item.courseId}
                        label={item.courseGroup}
                        subLabel={item.subjectId}
                        href={`${API_URL.COURSES}/${item.courseId}`}
                        isActive={`/${path}`.includes(`${API_URL.COURSES}/${item.courseId}`)}
                      />
                    ))}
                  </SidebarItem>
                  <Separator className="my-2" />
                </>
              )}
              <SidebarItem label="Đã đăng ký" icon={<GraduationCap size={20} />} isDropdown={true}>
                <SidebarItem
                  label="Việc cần làm"
                  icon={<NotebookPen size={20} />}
                  href="/todo"
                  isActive={path === 'todo'}
                />
                {enrolledCourses.map((item) => (
                  <SidebarItemClass
                    key={item.courseId}
                    label={item.courseGroup}
                    subLabel={item.subjectId}
                    href={`${API_URL.COURSES}/${item.courseId}`}
                    isActive={`/${path}`.includes(`${API_URL.COURSES}/${item.courseId}`)}
                  />
                ))}
              </SidebarItem>
            </>
          ) : (
            <Loading containerClassName="max-h-24" spinnerClassName="max-w-14 max-h-14 !border-8" />
          )}
          <Separator className="my-2" />
          <SidebarItem
            label="Lớp học đã lưu trữ"
            icon={<Import size={20} />}
            href="/archived"
            isActive={path === '/archived'}
          />
          <SidebarItem label="Cài đặt" icon={<Settings size={20} />} href="/settings" isActive={path === 'settings'} />
          {/* {userData?.roleId === 1 && (
            <SidebarItem
              label='Trang Admin'
              icon={<LayoutDashboard size={20} />}
              href='/dashboard'
            />
          )} */}
        </ul>
      </nav>
    )
  );
};

export default NavigationSidebar;
