'use client';

import React, { useContext, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import uploadService from '@/services/uploadService';
import { ICourse } from '@/types';
import { CourseContext } from '@/contexts/CourseContext';
import courseService from '@/services/courseService';

import UploadComponent from '../common/UploadComponent';

const CoursePersonalizeModal = ({ children, data }: { children: React.ReactNode; data: ICourse }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const { course, setCourse } = useContext(CourseContext);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (file) {
      setSelectedImageUrl(URL.createObjectURL(file));
    } else {
      setSelectedImageUrl(uploadedImageUrl || '');
    }
  }, [file, uploadedImageUrl]);

  useEffect(() => {
    setUploadedImageUrl(data.background || '');
    setSelectedImageUrl(data.background || '');
    setCourse(data);
  }, [data]);

  const handleUpload = async () => {
    if (!file || !course) return;

    try {
      setIsLoading(true);
      const res = await uploadService.uploadMultipleFileWithAWS3([file]);

      if (!res[0].url) return;

      await courseService.updateCourse(String(data.courseId), {
        ...data,
        background: res[0].url,
      });

      setUploadedImageUrl(res[0].url);
      setFile(null);

      toast({
        title: 'Tải ảnh lên thành công',
        description: 'Ảnh của bạn đã được tải lên và đặt làm ảnh bìa.',
      });

      setCourse({ ...course, background: res[0].url });
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-auto gap-0 transition-all text-black/85 font-sans">
        <DialogTitle className="font-medium h-fit">Tuỳ chỉnh giao diện</DialogTitle>

        <UploadComponent
          selectedImageUrl={selectedImageUrl}
          setFile={setFile}
          setUploadedImageUrl={setUploadedImageUrl}
          setSelectedImageUrl={setSelectedImageUrl}
        />
        <div className="flex justify-end mt-4">
          <Button variant="primary" onClick={handleUpload} disabled={isLoading}>
            Cập nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoursePersonalizeModal;
