import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { UserClient } from '@/components/tables/user-tables/client';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';
import { IUser } from '@/types';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Users', link: '/dashboard/users' },
];

export default async function page() {
  const {
    payload: { data: users },
  } = await http.get<IUser[]>(API_URL.USERS);

  return (
    <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <UserClient data={users} />
    </div>
  );
}
