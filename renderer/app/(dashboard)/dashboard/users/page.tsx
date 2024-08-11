import { fetcher } from '@/actions';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { UserClient } from '@/components/tables/user-tables/client';
import { API_URL } from '@/constants/endpoints';
import { ApiResponse, IUser } from '@/types';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Users', link: '/dashboard/users' },
];

export default async function page() {
  const { data: users } = await fetcher<ApiResponse<IUser[]>>(API_URL.USERS);

  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <UserClient data={users} />
      </div>
    </>
  );
}
