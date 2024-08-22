'use client';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { SubjectClient } from '@/components/tables/subject-tables/client';
import { API_URL } from '@/constants/endpoints';
import subjectService from '@/services/subjectService';
import { ApiResponse, ISubject } from '@/types';
import { useEffect, useState } from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Subjects', link: '/dashboard/subjects' },
];

export default function page() {
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  useEffect(() => {
    const fetchSubject = async () => {
      const response = await subjectService.getSubjects();
      setSubjects(response.data);
    };
    fetchSubject();
  }, []);
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <SubjectClient data={subjects} />
      </div>
    </>
  );
}
