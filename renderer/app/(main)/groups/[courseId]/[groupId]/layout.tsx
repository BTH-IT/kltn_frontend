import React from 'react';
import { redirect } from 'next/navigation';

import http from '@/libs/http';
import { API_URL } from '@/constants/endpoints';
import { ICourse, IGroup } from '@/types';
import GroupHeader from '@/components/common/GroupHeader';

export async function generateMetadata({ params }: { params: { courseId: string; groupId: string } }) {
  const { payload } = await http.get<IGroup>(`${API_URL.GROUPS}/${params.groupId}`);

  return {
    title: payload.data.groupName + ' - Group detail',
    description: 'Group detail',
  };
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string; groupId: string };
}) => {
  const {
    payload: { data: group },
  } = await http.get<IGroup>(`${API_URL.GROUPS}/${params.groupId}`);

  const {
    payload: { data: course },
  } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`);

  if (!course || !group) {
    return redirect('/');
  }

  return (
    <section className="p-6">
      <GroupHeader data={params} />
      {children}
    </section>
  );
};

export default Layout;
