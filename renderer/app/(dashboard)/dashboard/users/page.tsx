'use client';
import { useEffect, useState } from 'react';

import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { UserClient } from '@/components/tables/user-tables/client';
import { IUser } from '@/types';
import userService from '@/services/userService';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Users', link: '/dashboard/users' },
];

export default function Page() {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await userService.getUsers();
      setUsers(response.data);
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <UserClient data={users} />
      </div>
    </>
  );
}
