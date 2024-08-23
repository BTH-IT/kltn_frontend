import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { SubjectClient } from '@/components/tables/subject-tables/client';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';
import { ISubject } from '@/types';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Subjects', link: '/dashboard/subjects' },
];

export default async function page() {
  const {
    payload: { data: subjects },
  } = await http.get<ISubject[]>(API_URL.USERS);

  return (
    <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <SubjectClient data={subjects} />
    </div>
  );
}
