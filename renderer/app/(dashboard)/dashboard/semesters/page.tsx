import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { SemesterClient } from '@/components/tables/semester-tables/client';
import { ISemester } from '@/types/semester';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Semesters', link: '/dashboard/semesters' },
];
export default async function page() {
  const {
    payload: { data: semesters },
  } = await http.get<ISemester[]>(API_URL.SEMESTERS);

  return (
    <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <SemesterClient data={semesters} />
    </div>
  );
}
