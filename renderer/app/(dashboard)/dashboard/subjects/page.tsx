'use client';
import { useContext } from 'react';

import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { SubjectClient } from '@/components/tables/subject-tables/client';
import { CreateSubjectContext } from '@/contexts/CreateSubjectContext';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Subjects', link: '/dashboard/subjects' },
];

export default function Page() {
  const { subjects } = useContext(CreateSubjectContext);

  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <SubjectClient data={subjects} />
      </div>
    </>
  );
}
