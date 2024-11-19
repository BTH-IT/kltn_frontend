import React from 'react';

import http from '@/libs/http';
import { IGroup } from '@/types/group';
import ReportTimeline from '@/components/pages/groups/ReportTimeline';
import { API_URL } from '@/constants/endpoints';
import { revalidate } from '@/libs/utils';

const GroupReportPage = async ({ params }: { params: { courseId: string; groupId: string } }) => {
  const {
    payload: { data: group },
  } = await http.get<IGroup>(`${API_URL.GROUPS}/${params.groupId}`, {
    next: { revalidate: revalidate },
  });
  return <ReportTimeline group={group} />;
};

export default GroupReportPage;
