/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
'use client';

import { faGoogleDrive, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Link2, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useRef, useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { Controller } from 'react-hook-form';

import { YoutubeCardProps } from '@/components/common/YoutubeCard';
import AddLinkModal from '@/components/modals/AddLinkModal';
import AddYoutubeLinkModal from '@/components/modals/AddYoutubeLinkModal';
import AnnouncementFileList from '@/components/pages/courses/AnnoucementFileList';
import AnnouncementLinkList from '@/components/pages/courses/AnnouncementLinkList';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GOOGLE_FORM_TITLE } from '@/constants/common';
import { CourseContext } from '@/contexts/CourseContext';
import userService from '@/services/userService';
import { MetaLinkData } from '@/types';
import { formatDuration, getFileType } from '@/utils';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const GooglePicker = dynamic(() => import('react-google-picker'), {
  ssr: false,
});

const AssignmentForm = ({
  form,
  files,
  setFiles,
  links,
  setLinks,
  setIsLoading = () => {},
  exam = false,
}: {
  form: any;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  links: MetaLinkData[];
  setLinks: React.Dispatch<React.SetStateAction<MetaLinkData[]>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  exam?: boolean;
}) => {
  const user = null;

  const { course } = useContext(CourseContext);
  const [isOpenSelectLinkModal, setIsOpenSelectLinkModal] = useState(false);
  const [isOpenSelectYoutubeModal, setIsOpenSelectYoutubeModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [openPicker] = useDrivePicker();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const initGoogleForm = async () => {
      try {
        if (typeof window !== 'undefined') {
          setIsLoading(true);
          const data = { title: GOOGLE_FORM_TITLE, isQuiz: true };
          const response = await axios.post('/api/google', data);

          // https://docs.google.com/forms/d/{formId}/edit

          console.log('Form created:', response.data);

          setLinks((prev) => [
            ...prev,
            {
              title: response.data.form.info.title,
              description: response.data.form.info.documentTitle,
              image:
                'https://kstatic.googleusercontent.com/files/9f04faac24aed8bf8fb381029de951128d1d36373f89675265a6654d0c47b74b2d83a26b68b834ce2eea3bfe8001966f76895888138f135a81d099fc207c73bb',
              url: `https://docs.google.com/forms/d/${response.data.form.formId}`,
            },
          ]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error creating form:', error);
      }
    };

    if (isMounted && exam) {
      initGoogleForm();
    }
  }, [isMounted, exam]);

  const handleOpenPicker = () => {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
        })
        .then(async () => {
          const res = await userService.getCurrentUserToken();
          const { token } = res.data;
          const pickerConfig: any = {
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            developerKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
            viewId: 'DOCS',
            token: token ?? null,
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            callbackFunction: async (data: any) => {
              const elements = Array.from(
                document.getElementsByClassName('picker-dialog') as HTMLCollectionOf<HTMLElement>,
              );
              for (let i = 0; i < elements.length; i++) {
                elements[i].style.zIndex = '2000';
              }
              if (data.action === 'picked') {
                if (!token) {
                  const res = await userService.getCurrentUserToken();
                  const { token } = res.data;
                }
                const fetchOptions = {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                };
                const driveFileUrl = 'https://www.googleapis.com/drive/v3/files';

                const newLinks: any = await Promise.all(
                  data.docs.map(async (item: any) => {
                    const response = await fetch(`${driveFileUrl}/${item.id}?alt=media`, fetchOptions);
                    const blob = await response.blob();

                    const file = new File([blob], item.name, {
                      type: item.mimeType,
                    });

                    return {
                      title: file.name,
                      description: getFileType(file.type),
                      image: `https://lh3.googleusercontent.com/d/${item.id}=w200-h150-p-k-nu`,
                      url: `https://drive.google.com/file/d/${item.id}/view`,
                    };
                  }),
                );

                Promise.all(newLinks).then((res) => {
                  const existingFiles = files;

                  const updateLinks = [...existingFiles, ...newLinks].reduce((acc: MetaLinkData[], fl) => {
                    if (!acc.find((f) => f.image === fl.image)) {
                      acc.push(fl as MetaLinkData);
                    }
                    return acc;
                  }, []);

                  setLinks(updateLinks);
                });
              }
            },
          };
          openPicker(pickerConfig);
        });
    });
  };

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

  const handleAddYoutubeLink = (selectedVideo: YoutubeCardProps | null) => {
    if (selectedVideo) {
      setLinks((prev) => [
        ...prev,
        {
          title: selectedVideo.title,
          description: `Video trên Youtube • ${formatDuration(selectedVideo.duration)}`,
          image: selectedVideo.thumbnail,
          url: `https://www.youtube.com/watch?v=${selectedVideo.videoId}`,
        },
      ]);
      setIsOpenSelectYoutubeModal(false);
    }
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
                        placeholder="Nhập tên lớp học ..."
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
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase">Hướng dẫn (không bắt buộc)</FormLabel>
                  <FormControl>
                    <ReactQuill
                      theme="snow"
                      placeholder="Thông báo nội dung nào đó cho lớp học của bạn"
                      className="flex-1 rounded-md h-[230px]"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col w-full gap-5 p-4 mt-8 bg-white border rounded-xl">
            <h2 className="text-sm font-semibold">Đính kèm</h2>
            <div className="flex items-center justify-center gap-5">
              <div className="flex flex-col items-center justify-center gap-3">
                <Button
                  className="w-12 h-12 rounded-full p-0 border-[1px]"
                  variant="secondary3"
                  type="button"
                  onClick={() => handleOpenPicker()}
                >
                  <FontAwesomeIcon size="xl" icon={faGoogleDrive} />
                </Button>
                <p>Drive</p>
              </div>
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
          <AddLinkModal isOpen={isOpenSelectLinkModal} setIsOpen={setIsOpenSelectLinkModal} setLinks={setLinks} />
          <AddYoutubeLinkModal
            isOpen={isOpenSelectYoutubeModal}
            setIsOpen={setIsOpenSelectYoutubeModal}
            handleAddYoutubeLink={handleAddYoutubeLink}
          />
        </div>
      )}
    </>
  );
};

export default AssignmentForm;
