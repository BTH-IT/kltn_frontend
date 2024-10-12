import { API_URL } from '@/constants/endpoints';
import { ApiResponse, IScoreStructure } from '@/types';
import { ITranscript } from '@/types/transcript';

import configService from './configService';

const scoreStructureService = {
  getScoreStructureById(scoreStructureId: string): Promise<ApiResponse<IScoreStructure>> {
    return configService.get(`${API_URL.SCORE_STRUCTURES}/${scoreStructureId}`);
  },

  createScoreStructure(data: Partial<IScoreStructure>): Promise<ApiResponse<IScoreStructure>> {
    return configService.post(`${API_URL.SCORE_STRUCTURES}`, data);
  },

  getScoreStructureByCourseId(courseId: string): Promise<ApiResponse<IScoreStructure>> {
    return configService.get(`${API_URL.SCORE_STRUCTURES}/course/${courseId}/score-structure`);
  },

  getTranscript(courseId: string): Promise<ApiResponse<ITranscript[]>> {
    return configService.get(`${API_URL.SCORE_STRUCTURES}/${courseId}/transcripts`);
  },
};

export default scoreStructureService;
