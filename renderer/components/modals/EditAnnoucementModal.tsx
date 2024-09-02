/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
'use client';

import { faGoogleDrive, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link2, MessageSquare, Upload, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import GooglePicker from 'react-google-picker';
import React, { useEffect, useRef, useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { Controller, useForm } from 'react-hook-form';

import MultiSelectPeople, { Option } from '@/components/common/MultiSelectPeople';
import TooltipBottom from '@/components/common/TooltipBottom';
import AddLinkModal from '@/components/modals/AddLinkModal';
import AddYoutubeLinkModal from '@/components/modals/AddYoutubeLinkModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent2, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import announcementService from '@/services/announcementService';
import { Attachment, IAnnouncement, ICourse, IUser, MetaLinkData } from '@/types';
import { YoutubeCardProps } from '@/components/common/YoutubeCard';
import { formatDuration, getFileType, KEY_LOCALSTORAGE } from '@/utils';
import uploadService from '@/services/uploadService';
import userService from '@/services/userService';
import AnnouncementFileList from '@/components/pages/courses/AnnoucementFileList';
import AnnouncementLinkList from '@/components/pages/courses/AnnouncementLinkList';

import AnnouncementAttachList from '../common/AnnouncementAttachList';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EditAnnoucementModal = ({
  isOpen,
  setIsOpen,
  course,
  announcement,
  setAnnouncements,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  course: ICourse | null;
  announcement: IAnnouncement;
  setAnnouncements: React.Dispatch<React.SetStateAction<IAnnouncement[]>>;
}) => {
  const user = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}') as IUser;

  const [isOpenSelectLinkModal, setIsOpenSelectLinkModal] = useState(false);
  const [isOpenSelectYoutubeModal, setIsOpenSelectYoutubeModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [openPicker] = useDrivePicker();
  const [files, setFiles] = useState<File[]>([]);
  const [fileString, setFileString] = useState<Attachment[]>([]);
  const [linkString, setLinkString] = useState<Attachment[]>([]);
  const [links, setLinks] = useState<MetaLinkData[]>([]);
  const { control, handleSubmit, reset, formState } = useForm();
  const [optionSelected, setSelected] = useState<Option[] | null>(null);

  useEffect(() => {
    if (announcement.mentions.length <= 0) {
      setSelected(
        course?.students.map((student) => ({
          value: student.id,
          label: student.fullName,
          image: student.avatar,
        })) ?? [],
      );
    } else {
      setSelected(
        course?.students
          .filter((student) => announcement.mentions.includes(student.id))
          .map((student) => ({ value: student.id, label: student.fullName })) ?? [],
      );
    }

    setFileString(announcement.attachedLinks || []);
    setLinkString(announcement.attachments || []);
  }, [announcement, course, isOpen]);

  const handleOpenPicker = () => {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
        })
        .then(async () => {
          const tokenInfo = gapi.auth.getToken();

          const pickerConfig: any = {
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            developerKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
            viewId: 'DOCS',
            token: tokenInfo ? tokenInfo.access_token : null,
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
                const fetchOptions = {
                  headers: {
                    Authorization: `Bearer ${tokenInfo.access_token}`,
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

  const handleChange = (selected: Option[]) => {
    setSelected(selected);
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

  const onSubmit = async (values: any) => {
    if (!user?.id || !course?.courseId) return;

    try {
      const resAttachments = await uploadService.uploadMultipleFileWithAWS3(files);

      const announcementData = {
        content: values.content,
        attachments: JSON.stringify(resAttachments),
        attachedLinks: JSON.stringify(links),
        isPinned: announcement.isPinned,
        courseId: course.courseId,
        userId: user.id,
        mentions:
          optionSelected && optionSelected.length !== course.students.length
            ? optionSelected?.map((opt) => opt.value)
            : [],
      };

      const res = await announcementService.updateAnnouncement(
        course.courseId,
        announcement.announcementId,
        announcementData,
      );

      reset();
      setSelected(null);
      setIsOpen(false);
      setAnnouncements((prev) => [res.data, ...prev.filter((item) => item.announcementId !== res.data.announcementId)]);
    } catch (error) {
      console.log(error);
    }
  };

  const onClose = () => {
    if (isOpen) {
      reset();
      setSelected(null);
      setIsOpen(false);
    }
  };

  const options = course?.students.map((student) => {
    return {
      image: student.avatar,
      value: student.id,
      label: student.fullName,
    };
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent2 className="max-w-[750px] min-h-[450px] p-0 font-sans text-gray-700">
          <DialogHeader className="flex flex-row items-center justify-between px-6 py-3 border-b-2 h-fit">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100/60">
                <MessageSquare className="w-6 h-6 text-teal-600" />
              </div>
              <DialogTitle>Thông báo</DialogTitle>
            </div>
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="w-6 h-6" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div className="flex flex-col gap-4 px-3">
              <div className="font-medium">Dành cho</div>
              <MultiSelectPeople
                options={options}
                onChange={handleChange}
                value={optionSelected}
                isSelectAll={true}
                menuPlacement={'bottom'}
                className="w-[300px] "
              />
            </div>
            <div className="px-3 pt-3">
              <Controller
                name="content"
                control={control}
                defaultValue={announcement.content}
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    placeholder="Thông báo nội dung nào đó cho lớp học của bạn"
                    className="flex-1 rounded-md h-[180px]"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className="overflow-auto max-h-[240px]">
              <AnnouncementAttachList
                links={fileString}
                files={linkString}
                setFiles={setFileString}
                setLinks={setLinkString}
                isEdit
              />
              <AnnouncementFileList files={files} setFiles={setFiles} />
              <AnnouncementLinkList links={links} setLinks={setLinks} />
            </div>
            <DialogFooter className="px-6 pb-6 sm:items-end">
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-5">
                  <TooltipBottom content="Thêm tệp Google Drive">
                    <Button
                      className="w-12 h-12 rounded-full p-0 border-[1px]"
                      variant="secondary3"
                      type="button"
                      onClick={() => handleOpenPicker()}
                    >
                      <FontAwesomeIcon size="xl" icon={faGoogleDrive} />
                    </Button>
                  </TooltipBottom>
                  <TooltipBottom content="Thêm video trên Youtube">
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
                  </TooltipBottom>
                  <TooltipBottom content="Tải tệp lên">
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
                  </TooltipBottom>
                  <TooltipBottom content="Thêm đường liên kết">
                    <Button
                      onClick={() => setIsOpenSelectLinkModal(true)}
                      className="w-12 h-12 rounded-full p-0 border-[1px]"
                      variant="secondary3"
                      type="button"
                    >
                      <Link2 width={20} height={20} />
                    </Button>
                  </TooltipBottom>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      reset();
                    }}
                    disabled={formState.isSubmitting}
                    className="w-20"
                    variant="secondary3"
                    type="button"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={formState.isSubmitting || !(optionSelected !== null && optionSelected?.length > 0)}
                    className="w-20"
                    variant="primaryReverge"
                  >
                    {formState.isSubmitting && (
                      <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                    )}
                    Lưu
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </DialogContent2>
      </Dialog>
      <AddLinkModal isOpen={isOpenSelectLinkModal} setIsOpen={setIsOpenSelectLinkModal} setLinks={setLinks} />
      <AddYoutubeLinkModal
        isOpen={isOpenSelectYoutubeModal}
        setIsOpen={setIsOpenSelectYoutubeModal}
        handleAddYoutubeLink={handleAddYoutubeLink}
      />
    </>
  );
};

export default EditAnnoucementModal;
