import { API_URL } from '@/constants/endpoints';
import { ApiResponse, IScore } from '@/types';

import configService from './configService';

const scoreService = {
  createScoreSubmission(submissionId: string, scoreData: Partial<IScore>): Promise<ApiResponse<IScore>> {
    return configService.post(`${API_URL.SCORES}/${submissionId}/score`, {
      ...scoreData,
      submissionId,
    });
  },

  updateScoreSubmission(submissionId: string, scoreData: Partial<IScore>): Promise<ApiResponse<IScore>> {
    return configService.patch(`${API_URL.SCORES}/${submissionId}/score`, scoreData);
  },
};

export default scoreService;
