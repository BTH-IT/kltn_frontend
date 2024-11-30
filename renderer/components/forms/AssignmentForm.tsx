/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
'use client';

import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link2, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

import AnnouncementFileList from '@/components/pages/courses/AnnoucementFileList';
import AnnouncementLinkList from '@/components/pages/courses/AnnouncementLinkList';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MetaLinkData } from '@/types';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const AssignmentForm = ({
  form,
  files,
  setFiles,
  links,
  setLinks,
  setIsOpenSelectYoutubeModal,
  setIsOpenSelectLinkModal,
}: {
  form: any;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  links: MetaLinkData[];
  setLinks: React.Dispatch<React.SetStateAction<MetaLinkData[]>>;
  setIsOpenSelectYoutubeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSelectLinkModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const existingFiles = files;

    const updatedFiles = [...existingFiles, ...newFiles].reduce((acc: File[], fl) => {
      if (!acc.find((f) => f.name === fl.name)) {
        acc.push(fl);
      }
      return acc;
    }, []);

    setFiles(updatedFiles);
  };

  return (
    <>
      {isMounted && (
        <div className="max-w-[80%] mx-auto p-3">
          <div className="flex flex-col gap-3 px-4 py-6 bg-white border rounded-lg">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase">Tiêu đề</FormLabel>
                  <FormControl>
                    <>
                      <Input
                        className={'text-black focus-visible:ring-0 focus-visible:ring-offset-0'}
                        id="className"
                        placeholder="Nhập tên tiêu đề ..."
                        {...field}
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              name="content"
              control={form.control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <h2 className="text-xs font-bold uppercase">Hướng dẫn (không bắt buộc)</h2>
                  <ReactQuill
                    theme="snow"
                    placeholder="Mô tả"
                    className="flex-1 rounded-md h-[230px]"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </>
              )}
            />
          </div>
          <div className="flex flex-col w-full gap-5 p-4 mt-8 bg-white border rounded-xl">
            <h2 className="text-sm font-semibold">Đính kèm</h2>
            <div className="flex items-center justify-center gap-5">
              <div className="flex flex-col items-center justify-center gap-3">
                <Button
                  onClick={() => {
                    setIsOpenSelectYoutubeModal(true);
                  }}
                  className="w-12 h-12 rounded-full p-0 border-[1px]"
                  variant="secondary3"
                  type="button"
                >
                  <FontAwesomeIcon size="xl" icon={faYoutube} />
                </Button>
                <p>Youtube</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-3">
                <Button
                  className="w-12 h-12 rounded-full p-0 border-[1px]"
                  variant="secondary3"
                  type="button"
                  onClick={() => {
                    if (fileRef?.current) {
                      fileRef.current.click();
                    }
                  }}
                >
                  <Upload width={20} height={20} />
                </Button>
                <input
                  id="fileInput"
                  ref={fileRef}
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <p>Tải lên</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-3">
                <Button
                  onClick={() => setIsOpenSelectLinkModal(true)}
                  className="w-12 h-12 rounded-full p-0 border-[1px]"
                  variant="secondary3"
                  type="button"
                >
                  <Link2 width={20} height={20} />
                </Button>
                <p>Liên kết</p>
              </div>
            </div>
            <AnnouncementFileList files={files} setFiles={setFiles} />
            <AnnouncementLinkList links={links} setLinks={setLinks} />
          </div>
        </div>
      )}
    </>
  );
};

export default AssignmentForm;
