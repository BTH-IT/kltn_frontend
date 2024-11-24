'use client';
import { useEffect, useState } from 'react';

import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { CourseClient } from '@/components/tables/course-tables/client';
import { ICourse } from '@/types';
import courseService from '@/services/courseService';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Courses', link: '/dashboard/courses' },
];

export default function Page() {
  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      const response = await courseService.getCourses();
      setCourses(response.data);
    };
    fetchCourse();
  }, []);

  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <CourseClient data={courses} />
      </div>
    </>
  );
}
