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
      const url = await uploadService.uploadFile(file);

      await courseService.updateCourse(String(data.classId), {
        ...data,
        background: url,
      });

      setUploadedImageUrl(url);
      setFile(null);

      toast({
        title: 'Image Uploaded Successfully',
        description: 'Your image has been uploaded and set as the cover image.',
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
