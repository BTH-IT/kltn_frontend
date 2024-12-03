import React from 'react';

import http from '@/libs/http';
import { IGroup } from '@/types/group';
import ReportTimeline from '@/components/pages/groups/ReportTimeline';
import { API_URL } from '@/constants/endpoints';

const GroupReportPage = async ({ params }: { params: any }) => {
  const {
    payload: { data: group },
  } = await http.get<IGroup>(`${API_URL.GROUPS}/${params.groupId}`);
  return <ReportTimeline group={group} />;
};

export default GroupReportPage;
