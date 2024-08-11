import Image from 'next/image';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

import { fetcher } from '@/actions';
import { API_URL } from '@/constants/endpoints';
import InviteButton from '@/components/pages/classes/invite/InviteButton';
import { IClasses } from '@/types';

const InviteCodePage = async ({ params }: { params: { inviteCode: string } }) => {
  const { inviteCode } = params;
  const user = await currentUser();

  if (!user) {
    return redirect('/login');
  }

  const classData = await fetcher<IClasses | null>(`${API_URL.CLASSES}/invite/${inviteCode}`);

  if (!classData) {
    return redirect('/');
  }

  const existUser = classData?.students?.some((s: any) => s.userId === user.id);

  if (existUser) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col justify-center items-center p-10 w-full h-full">
      <div className="max-w-[800px] m-auto rounded-lg border text-primaryGray">
        <div className="flex flex-col justify-center items-center gap-4 py-8 bg-[#F1F3F4]">
          <Image
            width={1000}
            height={1000}
            className="w-[100px] h-[100px] object-cover"
            src="/images/logo_square_rounded.svg"
            alt="logo"
          />
          <h2 className="text-3xl font-bold">Classroom</h2>
          <p className="text-sm text-center">
            Lớp học giúp các lớp học giao tiếp, tiết kiệm thời gian và luôn có tổ chức.
          </p>
        </div>
        <div className="flex flex-col gap-5 justify-center items-center p-8">
          <p className="text-sm text-center">Bạn đang tham gia lớp học với tư cách học viên.</p>
          <InviteButton inviteCode={inviteCode} />
          <p className="text-sm text-center">
            Bằng việc tham gia, bạn đồng ý chia sẻ thông tin liên hệ với những người trong lớp của bạn. Ứng dụng sẽ sử
            dụng các dịch vụ của Google Workspace, trong đó có Drive và Lịch.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteCodePage;
