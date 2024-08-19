/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
'use client';

import { faGoogleDrive, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link2, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useCallback, useContext, useRef, useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { Controller, useForm } from 'react-hook-form';

import MultiSelectClassroom from '@/components/common/MultiSelectClassroom';
import MultiSelectPeople, { Option } from '@/components/common/MultiSelectPeople';
import TooltipBottom from '@/components/common/TooltipBottom';
import { YoutubeCardProps } from '@/components/common/YoutubeCard';
import AddLinkModal from '@/components/modals/AddLinkModal';
import AddYoutubeLinkModal from '@/components/modals/AddYoutubeLinkModal';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { CoursesContext } from '@/contexts/CoursesContext';
import announcementService from '@/services/announcementService';
import uploadService from '@/services/uploadService';
import userService from '@/services/userService';
import { IAnnouncement, ICourse, IUser, MetaLinkData } from '@/types';
import { formatDuration, getFileType, KEY_LOCALSTORAGE } from '@/utils';
import { cn } from '@/libs/utils';

import AnnouncementFileList from './AnnoucementFileList';
import AnnouncementLinkList from './AnnouncementLinkList';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const BulletForm = ({
  setIsPost,
  course,
  setAnnouncements,
}: {
  setIsPost: React.Dispatch<React.SetStateAction<boolean>>;
  course: ICourse | null;
  setAnnouncements: React.Dispatch<React.SetStateAction<IAnnouncement[]>>;
}) => {
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}') as IUser;

  const [isOpenSelectLinkModal, setIsOpenSelectLinkModal] = useState(false);
  const [isOpenSelectYoutubeModal, setIsOpenSelectYoutubeModal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [openPicker] = useDrivePicker();
  const [links, setLinks] = useState<MetaLinkData[]>([]);
  const { control, handleSubmit, reset, formState } = useForm();
  const { createdCourses } = useContext(CoursesContext);
  const [mentionOptionSelected, setMentionOptionSelected] = useState<Option[] | null>(null);
  const [courseOptionSelected, setCourseOptionSelected] = useState<Option[] | null>([
    {
      label: course?.courseGroup ?? '',
      value: course?.courseId ?? '',
      default: true,
    },
  ]);

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
    console.log(existingFiles);

    const updatedFiles = [...existingFiles, ...newFiles].reduce((acc: File[], fl) => {
      if (!acc.find((f) => f.name === fl.name)) {
        acc.push(fl);
      }
      return acc;
    }, []);

    setFiles(updatedFiles);
  };

  const courseHandleChange = useCallback(
    (selected: Option[]) => {
      if (!selected.some((opt) => opt.default === true)) {
        setCourseOptionSelected([
          {
            label: course?.courseGroup ?? '',
            value: course?.courseId ?? '',
            default: true,
          },
          ...selected,
        ]);
      } else setCourseOptionSelected(selected);
      if (selected.length > 1) {
        setMentionOptionSelected(null);
      }
    },
    [course],
  );

  const mentionHandleChange = useCallback((selected: Option[]) => {
    setMentionOptionSelected(selected);
  }, []);

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
    if (!user?.id || !course?.classId) return;

    try {
      const resAttachments = await uploadService.uploadMultipleFileWithAWS3(files);

      const res = await announcementService.createAnnouncement({
        content: values.content,
        courseId: course.courseId,
        userId: user.id,
        attachedLinks: JSON.stringify(links),
        attachments: JSON.stringify(resAttachments),
        // mentions: JSON.stringify(
        //   mentionOptionSelected &&
        //     mentionOptionSelected.length !== course.students.length
        //     ? mentionOptionSelected?.map((opt) => opt.value)
        //     : ['all']
        // ),
      });

      let announceCount = 1;

      if (courseOptionSelected) {
        await Promise.all(
          courseOptionSelected.map(async (opt) => {
            console.log(opt.value);
            if (opt.value !== course.courseId) {
              const res = await announcementService.createAnnouncement({
                content: values.content,
                courseId: String(opt.value),
                userId: user.id,
                attachedLinks: JSON.stringify(links),
                attachments: JSON.stringify(resAttachments),
                // mentions: JSON.stringify(['all']),
              });
              if (res.data) {
                announceCount++;
              }
            }
          }),
        );
      }

      if (res.data) {
        toast({
          title: `Đã đăng (${announceCount}) thông báo thành công`,
          variant: 'done',
          duration: 2000,
        });
      }

      reset();
      setIsPost(false);

      setAnnouncements((prev) => [res.data, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };

  const generateClassOptions = useCallback(() => {
    return createdCourses
      ?.map((c) => {
        return {
          label: c.name,
          value: c.courseId,
          default: c.courseId === course?.courseId,
        };
      })
      .sort((a, b) => {
        if (a.default) return -1;
        if (b.default) return 1;
        return 0;
      });
  }, [createdCourses, course]);

  const generateMentionOptions = useCallback(() => {
    // return course?.students.map((student) => {
    //   return {
    //     image: student.avatarUrl,
    //     label: student.name,
    //     value: student.userId,
    //   };
    // });

    return [].map((student) => {
      return {
        image: '',
        label: 'student.name',
        value: 'student.userId',
      };
    });
  }, [course]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-4 px-3">
          {user?.id === course?.lecturerId && (
            <div className="flex items-center gap-10">
              <div>
                <div className="mb-2 font-medium">Đăng trong</div>
                <MultiSelectClassroom
                  options={generateClassOptions()}
                  onChange={courseHandleChange}
                  value={courseOptionSelected}
                  isSelectAll={true}
                  menuPlacement={'bottom'}
                  className="w-[300px]"
                />
              </div>
              <div className={cn('', (courseOptionSelected?.length ?? 0) > 1 && 'hidden')}>
                <div className="mb-2 font-medium">Dành cho</div>
                <MultiSelectPeople
                  isDisabled={(courseOptionSelected?.length ?? 0) > 1}
                  options={generateMentionOptions()}
                  onChange={mentionHandleChange}
                  value={mentionOptionSelected}
                  isSelectAll={true}
                  menuPlacement={'bottom'}
                  className="w-[300px]"
                />
              </div>
            </div>
          )}
        </div>
        <div className="px-3 pt-3">
          <Controller
            name="content"
            control={control}
            defaultValue=""
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
        <div>
          <AnnouncementFileList files={files} setFiles={setFiles} />
          <AnnouncementLinkList links={links} setLinks={setLinks} />
        </div>
        <div className="p-3 sm:items-end">
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
                  setIsPost(false);
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
                disabled={
                  user?.id === course?.courseId &&
                  (formState.isSubmitting ||
                    !(courseOptionSelected !== null && courseOptionSelected?.length > 0) ||
                    !(
                      courseOptionSelected.length > 1 ||
                      (mentionOptionSelected !== null && mentionOptionSelected?.length > 0)
                    ))
                }
                className="w-20"
                variant="primaryReverge"
              >
                {formState.isSubmitting && (
                  <div className="w-4 h-4 mr-1 border border-black border-solid rounded-full animate-spin border-t-transparent"></div>
                )}
                Đăng
              </Button>
            </div>
          </div>
        </div>
      </form>
      <AddLinkModal isOpen={isOpenSelectLinkModal} setIsOpen={setIsOpenSelectLinkModal} setLinks={setLinks} />
      <AddYoutubeLinkModal
        isOpen={isOpenSelectYoutubeModal}
        setIsOpen={setIsOpenSelectYoutubeModal}
        handleAddYoutubeLink={handleAddYoutubeLink}
      />
    </>
  );
};

export default BulletForm;
