'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { ICourse } from '@/types';

import { Card, CardContent, CardHeader } from '../ui/card';

const CourseCard = ({ item }: { item: ICourse }) => {
  return (
    <Link href={`/courses/${item.courseId}`}>
      <Card
        className="font-sans rounded-xl overflow-hidden cursor-pointer relative
                hover:shadow-[0_1px_2px_0_rgba(60,64,67,.3),0_2px_6px_2px_rgba(60,64,67,.15)]"
      >
        <CardHeader className="relative text-white">
          <Image
            src={item.background ?? 'https://gstatic.com/classroom/themes/img_backtoschool.jpg'}
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            className="z-0 brightness-90"
          />
          <div className="z-10 p-4">
            <div className="font-semibold text-2xl max-w-[252px] truncate shadow-inner">{item.name}</div>
            <div className="max-w-[185px] text-sm truncate font-normal shadow-inner">{item.subject?.name}</div>
          </div>
          <Image
            src={item.lecturer?.avatar || '/images/avt.png'}
            alt="Avatar"
            width={75}
            height={75}
            className="absolute bottom-0 translate-y-1/2 rounded-full right-5"
          />
        </CardHeader>

        <CardContent>
          <div className="h-20"></div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
