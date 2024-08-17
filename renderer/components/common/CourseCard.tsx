'use client';

import React from 'react';
import { Folder, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { ICourse } from '@/types';

import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';

const CourseCard = ({ item }: { item: ICourse }) => {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`courses/${item.courseId}`)}
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
          <div className="font-semibold text-2xl max-w-[252px] truncate shadow-inner">{item.courseGroup}</div>
          <div className="max-w-[185px] text-sm truncate font-normal shadow-inner">{item.subjectName}</div>
        </div>
        <Image
          src={'/images/avt.png'}
          alt="Avatar"
          width={75}
          height={75}
          className="absolute bottom-0 translate-y-1/2 rounded-full right-5"
        />
      </CardHeader>

      <CardContent>
        <div className="h-24"></div>
      </CardContent>
      <CardFooter className="flex gap-6 items-center justify-end border-t-[1px] px-4 pt-[13px]">
        <Button variant="ghost" className="px-0">
          <TrendingUp />
        </Button>
        <Button variant="ghost" className="px-0">
          <Folder />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
