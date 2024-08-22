'use client';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { SemesterClient } from '@/components/tables/semester-tables/client';
import semesterService from '@/services/semesterService';
import { ISemester } from '@/types/semester';
import { useEffect, useState } from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Semesters', link: '/dashboard/semesters' },
];
export default function page() {
  const [semesters, setSemesters] = useState<ISemester[]>([]);

  useEffect(() => {
    const fetchSemester = async () => {
      const response = await semesterService.getSemesters();
      setSemesters(response.data);
    };
    fetchSemester();
  }, []);
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <SemesterClient data={semesters} />
      </div>
    </>
  );
}
