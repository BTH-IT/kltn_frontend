import { API_URL } from '@/constants/endpoints';
import { ApiResponse, IScoreStructure } from '@/types';

import configService from './configService';

const scoreStructureService = {
  getScoreStructureById(scoreStructureId: string): Promise<ApiResponse<IScoreStructure>> {
    return configService.get(`${API_URL.SCORE_STRUCTURES}/${scoreStructureId}`);
  },

  createScoreStructure(data: Partial<IScoreStructure>): Promise<ApiResponse<IScoreStructure>> {
    return configService.post(`${API_URL.SCORE_STRUCTURES}`, data);
  },

  getScoreStructureByCourseId(courseId: string): Promise<ApiResponse<IScoreStructure>> {
    return configService.get(`${API_URL.SCORE_STRUCTURES}${API_URL.COURSES}/${courseId}/score-structure`);
  },
};

export default scoreStructureService;
