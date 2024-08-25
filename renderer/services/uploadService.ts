import { API_URL } from '@/constants/endpoints';

import configService from './configService';

const uploadService = {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await configService.post(`${API_URL.UPLOAD}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return (res as any).url; // Assuming the response contains the URL in res.data.url
    } catch (error) {
      console.error('Error uploading file:', error);
      return '';
    }
  },

  async uploadMultipleFileWithAWS3(files: File[]): Promise<{ url: string; type: string }[]> {
    const formData = new FormData();

    // Append each file to the form data
    files.forEach((file) => {
      formData.append('file', file);
    });

    try {
      const res = await configService.post(`${API_URL.UPLOAD}/s3/multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return (res as any).data; // Assuming the response contains the URL in res.data.url
    } catch (error) {
      console.error('Error uploading file:', error);
      return [];
    }
  },
};

export default uploadService;
