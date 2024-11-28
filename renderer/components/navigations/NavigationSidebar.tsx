'use client';

import React, { useContext, useEffect, useState } from 'react';
import '@/styles/components/navigation/nav-sidebar.scss';
import { House, GraduationCap, Settings, Users, Pocket, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import { API_URL } from '@/constants/endpoints';
import { SidebarContext } from '@/contexts/SidebarContext';
import { CoursesContext } from '@/contexts/CoursesContext';
import { ICourse } from '@/types';

import SidebarItem from '../items/SidebarItem';
import SidebarItemClass from '../items/SidebarItemClass';
import Loading from '../loading/loading';

const NavigationSidebar = () => {
  const { isShow } = useContext(SidebarContext);

  const pathname = usePathname();
  const { enrolledCourses, createdCourses, isLoading } = useContext(CoursesContext);

  const path = pathname?.slice(1, pathname.length - 1);

  const [isMounted, setIsMounted] = useState(false);
  const [searchCreatedCourse, setSearchCreatedCourse] = useState('');
  const [searchEnrolledCourse, setSearchEnrolledCourse] = useState('');
  const [filteredCreatedCourses, setFilteredCreatedCourses] = useState<ICourse[]>([]);
  const [filteredEnrolledCourses, setFilteredEnrolledCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setFilteredCreatedCourses(
      createdCourses.filter((course) => course.name?.toLowerCase().includes(searchCreatedCourse.toLowerCase())),
    );
  }, [searchCreatedCourse, createdCourses]);

  useEffect(() => {
    setFilteredEnrolledCourses(
      enrolledCourses.filter((course) => course.name?.toLowerCase().includes(searchEnrolledCourse.toLowerCase())),
    );
  }, [searchEnrolledCourse, enrolledCourses]);

  return (
    isMounted && (
      <nav
        className={`sidebarbg-white border-gray-300 overflow-hidden border-r-[0.5px] py-3 max-w-[250px] h-[calc(100vh-70px)] transition-all duration-500 mt-[70px] ${
          !isShow ? 'w-[70px]' : 'w-[250px]'
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <ul>
            <SidebarItem label="Màn hình chính" icon={<House size={20} />} href="/" isActive={path === ''} />
            <Separator className="my-2" />
            {!isLoading ? (
              <>
                <SidebarItem label="Giảng dạy" icon={<Users size={20} />} isDropdown={true}>
                  <div className="px-6 mb-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Tìm kiếm khóa học..."
                        value={searchCreatedCourse}
                        onChange={(e) => setSearchCreatedCourse(e.target.value)}
                        className="w-full py-1 pl-8 pr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search className="absolute text-gray-400 transform -translate-y-1/2 left-2 top-1/2" size={16} />
                    </div>
                  </div>
                  <div className="max-h-[130px] min-h-[130px] overflow-y-auto">
                    {filteredCreatedCourses.length > 0 ? (
                      filteredCreatedCourses.map((item) => (
                        <SidebarItemClass
                          key={item.courseId}
                          label={item.name}
                          subLabel={item.subject?.subjectCode}
                          href={`${API_URL.COURSES}/${item.courseId}`}
                          isActive={`/${path}`.includes(`${API_URL.COURSES}/${item.courseId}`)}
                        />
                      ))
                    ) : (
                      <p className="px-4 mt-2 text-sm text-center text-gray-500">Không có khóa học nào</p>
                    )}
                  </div>
                </SidebarItem>
                <Separator className="my-2" />
                <SidebarItem label="Đã đăng ký" icon={<GraduationCap size={20} />} isDropdown={true}>
                  <div className="px-6 mb-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchEnrolledCourse}
                        onChange={(e) => setSearchEnrolledCourse(e.target.value)}
                        placeholder="Tìm kiếm khóa học..."
                        className="w-full py-1 pl-8 pr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search className="absolute text-gray-400 transform -translate-y-1/2 left-2 top-1/2" size={16} />
                    </div>
                  </div>
                  <div className="max-h-[130px] min-h-[130px] overflow-y-auto">
                    {filteredEnrolledCourses.length > 0 ? (
                      filteredEnrolledCourses.map((item) => (
                        <SidebarItemClass
                          key={item.courseId}
                          label={item.name}
                          subLabel={item.subject?.subjectCode}
                          href={`${API_URL.COURSES}/${item.courseId}`}
                          isActive={`/${path}`.includes(`${API_URL.COURSES}/${item.courseId}`)}
                        />
                      ))
                    ) : (
                      <p className="px-4 mt-2 text-sm text-center text-gray-500">Không có khóa học nào</p>
                    )}
                  </div>
                </SidebarItem>
              </>
            ) : (
              <Loading />
            )}
          </ul>
          <div>
            <Separator className="my-2" />
            <ul className="flex flex-col gap-3 mt-4 mb-2">
              <SidebarItem
                label="Lớp học đã lưu trữ"
                icon={<Pocket size={20} />}
                href="/archives"
                isActive={path === 'archives'}
              />
              <SidebarItem
                label="Cài đặt"
                icon={<Settings size={20} />}
                href="/settings"
                isActive={path === 'settings'}
              />
            </ul>
          </div>
        </div>
      </nav>
    )
  );
};

export default NavigationSidebar;
