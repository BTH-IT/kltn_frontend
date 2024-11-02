'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import uploadService from '@/services/uploadService';
import { ICourse } from '@/types';
import courseService from '@/services/courseService';

import UploadComponent from '../common/UploadComponent';

const CoursePersonalizeModal = ({ children, data }: { children: React.ReactNode; data: ICourse }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

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
  }, [data]);

  const handleImageUpload = (url: string) => {
    setUploadedImageUrl(url);
    toast({
      title: 'Image Uploaded Successfully',
      description: 'Your image has been uploaded and set as the cover image.',
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
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

      router.refresh();
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-auto gap-0 transition-all text-black/85 font-sans">
        <DialogTitle className="font-medium h-fit">Tuỳ chỉnh giao diện</DialogTitle>

        <UploadComponent onUpload={handleImageUpload} selectedImageUrl={selectedImageUrl} setFile={setFile} />
        <div className="flex justify-end mt-4">
          <Button variant="primary" onClick={handleUpload}>
            Cập nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoursePersonalizeModal;
