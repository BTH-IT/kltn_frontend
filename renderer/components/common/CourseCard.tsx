'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Book, Users } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { ICourse } from '@/types';

const CourseCard = ({ item }: { item: ICourse }) => {
  return (
    <Link href={`/courses/${item.courseId}`}>
      <Card className="font-sans rounded-xl overflow-hidden cursor-pointer bg-white hover:shadow-lg transition-all duration-300 group h-[280px] relative">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/60 to-black/90"></div>
        <div className="relative h-full">
          <Image
            src={item.background ?? 'https://gstatic.com/classroom/themes/img_backtoschool.jpg'}
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            className="z-0 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 z-20 p-6">
            <h2 className="mb-3 text-2xl font-bold leading-tight text-white transition-colors duration-300 line-clamp-2 group-hover:text-blue-400 shadow-text">
              {item.name}
            </h2>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="flex items-center gap-2 mb-1 text-base font-semibold text-gray-100 shadow-text">
                  <Book size={18} className="flex-shrink-0 text-blue-300" />
                  <span className="truncate">{item.subject?.name}</span>
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-200 shadow-text">
                  <Users size={16} className="flex-shrink-0 text-green-300" />
                  <span className="truncate">{item.studentsCount ?? 0} học viên</span>
                </p>
              </div>

              <div className="flex items-center flex-shrink-0 gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src={item.lecturer?.avatar || '/images/avt.png'}
                    alt={`Avatar of ${item.lecturer?.fullName || item.lecturer?.userName || 'N/A'}`}
                    fill
                    className="object-cover border-2 border-white rounded-full shadow-md"
                  />
                </div>
                <div className="max-w-[120px]">
                  <p className="text-sm font-semibold text-gray-100 truncate shadow-text">Giảng viên</p>
                  <p className="text-xs text-gray-200 truncate shadow-text">
                    {item.lecturer?.fullName || item.lecturer?.userName || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CourseCard;
