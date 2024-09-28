'use client';

import React, { useContext, useEffect, useState } from 'react';
import '@/styles/components/navigation/nav-sidebar.scss';
import { House, Calendar, GraduationCap, Settings, Users, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import { API_URL } from '@/constants/endpoints';
import { SidebarContext } from '@/contexts/SidebarContext';
import { CoursesContext } from '@/contexts/CoursesContext';
import { IUser } from '@/types';

import SidebarItem from '../items/SidebarItem';
import SidebarItemClass from '../items/SidebarItemClass';
import Loading from '../loading/loading';

const NavigationSidebar = () => {
  const { isShow } = useContext(SidebarContext);

  const pathname = usePathname();
  const { enrolledCourses, createdCourses, isLoading } = useContext(CoursesContext);

  const path = pathname?.slice(1, pathname.length - 1);

  const [isMounted, setIsMounted] = useState(false);
  const [userData, setUserData] = useState<IUser | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setUserData(JSON.parse(localStorage.getItem('user') || '{}') as IUser);
  }, []);

  return (
    isMounted && (
      <nav
        className={`sidebarbg-white border-gray-300 overflow-hidden border-r-[0.5px] py-3 max-w-[250px] h-[calc(100vh-70px)] transition-all duration-500 mt-[70px] ${
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
                    <div className="max-h-[175px] min-h-[175px] overflow-y-auto">
                      {createdCourses.map((item) => (
                        <SidebarItemClass
                          key={item.courseId}
                          label={item.name}
                          subLabel={item.subject?.subjectCode}
                          href={`${API_URL.COURSES}/${item.courseId}`}
                          isActive={`/${path}`.includes(`${API_URL.COURSES}/${item.courseId}`)}
                        />
                      ))}
                    </div>
                  </SidebarItem>
                  <Separator className="my-2" />
                </>
              )}
              <SidebarItem label="Đã đăng ký" icon={<GraduationCap size={20} />} isDropdown={true}>
                <div className="max-h-[175px] min-h-[175px] overflow-y-auto">
                  {enrolledCourses.map((item) => (
                    <SidebarItemClass
                      key={item.courseId}
                      label={item.name}
                      subLabel={item.subject?.subjectCode}
                      href={`${API_URL.COURSES}/${item.courseId}`}
                      isActive={`/${path}`.includes(`${API_URL.COURSES}/${item.courseId}`)}
                    />
                  ))}
                </div>
              </SidebarItem>
            </>
          ) : (
            <Loading containerClassName="max-h-24" spinnerClassName="max-w-14 max-h-14 !border-8" />
          )}
          <Separator className="my-2" />
          <SidebarItem label="Cài đặt" icon={<Settings size={20} />} href="/settings" isActive={path === 'settings'} />
          {userData?.userType === 1 && (
            <SidebarItem label="Trang Admin" icon={<LayoutDashboard size={20} />} href="/dashboard" />
          )}
        </ul>
      </nav>
    )
  );
};

export default NavigationSidebar;
