import { cache, Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { Info, Pencil } from 'lucide-react';
import { redirect } from 'next/navigation';

import AnnouncementInput from '@/components/common/AnnouncementInput';
import Loading from '@/components/loading/loading';
import classRequest from '@/libs/requests/classRequest';
import ClassPersonalizeModal from '@/components/modals/ClassPersonalizeModal';
import { Button } from '@/components/ui/button';
import InviteCode from '@/components/pages/classes/InviteCode';
import { ApiResponse, IUser } from '@/types';
import { fetcher } from '@/actions';
import { API_URL } from '@/constants/endpoints';
import ChangeStudentIdModal from '@/components/modals/ChangeStudentIdModal';

const cacheFetcher = cache(classRequest.getDetail);

export default async function ClassPage({ params }: { params: { classId: string } }) {
  const { data: classes } = await cacheFetcher(params.classId);

  const user = await currentUser();

  const { data: userDetail } = await fetcher<ApiResponse<IUser>>(`${API_URL.USERS}/${user?.id}`);

  if (user?.id !== classes.teacherId && !classes.students.find((student) => student.userId === user?.id)) {
    redirect('/');
  }

  const bgImageStyles = {
    backgroundImage: `url(${classes.background || ''})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  return (
    <Suspense fallback={<Loading />}>
      {userDetail.studentId.length === 0 && userDetail.roleId === 3 ? (
        <ChangeStudentIdModal user={userDetail} isOpen={true} />
      ) : (
        <section>
          <div className={'overflow-hidden relative w-full rounded-lg h-[240px]'} style={bgImageStyles}>
            <div className="absolute w-full h-full bg-custom-radial-gradient"></div>
            <div className="flex absolute bottom-4 left-4 flex-col gap-2 w-full text-white">
              <h2 className="text-3xl font-bold">{classes.name}</h2>
              <p className="text-xl font-medium">
                {classes.subjectId} - {classes.subject?.name}
              </p>
            </div>
            {user?.id === classes.teacherId && (
              <ClassPersonalizeModal data={classes}>
                <Button
                  variant="ghost"
                  className="flex absolute top-4 right-4 gap-3 items-center py-1 px-3 text-[16px] text-blue-500 bg-white"
                >
                  <Pencil width={18} height={18} />
                  <span>Tùy chỉnh</span>
                </Button>
              </ClassPersonalizeModal>
            )}
            <Info
              className="absolute right-4 bottom-4 flex-col p-2 text-white rounded-full transition-all hover:bg-[rgba(0, 0, 0, 0.8)] cursor-pointer"
              width={36}
              height={36}
            />
          </div>
          <div className="grid grid-cols-12 gap-6 mt-10">
            <div className="flex flex-col col-span-3 gap-4">
              <InviteCode inviteCode={classes.inviteCode} teacherId={classes.teacherId} name={classes.name} />
              <div className="p-4 rounded-md border">
                <div className="flex gap-3 justify-between items-center mb-3">
                  <h2>Sắp đến hạn</h2>
                </div>
                <div className="flex gap-3 items-center mb-3">
                  <p className="text-xs text-gray-400">Không có bài tập nào sắp đến hạn</p>
                </div>
                <div className="flex justify-end">
                  <button className="p-2 text-sm rounded-md hover:bg-slate-100">Xem tất cả</button>
                </div>
              </div>
            </div>
            <div className="col-span-9">
              <AnnouncementInput classes={classes} />
            </div>
          </div>
        </section>
      )}
    </Suspense>
  );
}
