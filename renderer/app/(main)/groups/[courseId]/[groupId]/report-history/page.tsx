import React from 'react';

import http from '@/libs/http';
import { API_URL } from '@/constants/endpoints';
import ReportHistory from '@/components/pages/groups/ReportHistory';
import { IBrief } from '@/types';

const GroupReportPage = async ({ params }: { params: { courseId: string; groupId: string } }) => {
  const {
    payload: { data: briefs },
  } = await http.get<IBrief[]>(`${API_URL.BRIEFS}/${params.groupId}/brief`);

  return <ReportHistory briefs={briefs} />;
};

export default GroupReportPage;
