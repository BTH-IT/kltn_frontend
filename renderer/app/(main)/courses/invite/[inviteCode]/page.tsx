import Image from 'next/image';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { API_URL } from '@/constants/endpoints';
import InviteButton from '@/components/pages/courses/invite/InviteButton';
import http from '@/libs/http';
import { ICourse } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';

const InviteCodePage = async ({ params }: { params: { inviteCode: string } }) => {
  const { inviteCode } = params;

  const cookieStore = cookies();
  const userCookie = cookieStore.get(KEY_LOCALSTORAGE.CURRENT_USER)?.value;
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;

  if (!user) {
    return redirect('/login');
  }

  const {
    payload: { data: course },
  } = await http.get<ICourse | null>(`${API_URL.COURSES}/invite/${inviteCode}`);

  if (!course) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-10">
      <div className="max-w-[800px] m-auto rounded-lg border text-primaryGray">
        <div className="flex flex-col justify-center items-center gap-4 py-8 px-3 bg-[#F1F3F4]">
          <Image
            width={1000}
            height={1000}
            className="w-[100px] h-[100px] object-cover"
            src="/images/logo.png"
            alt="logo"
          />
          <h2 className="text-3xl font-bold">Courseroom</h2>
          <p className="text-sm text-center">
            Lớp học giúp các lớp học giao tiếp, tiết kiệm thời gian và luôn có tổ chức.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-5 p-8">
          <p className="text-sm text-center">Bạn đang tham gia lớp học với tư cách học viên.</p>
          <InviteButton inviteCode={inviteCode} />
          <p className="text-sm text-center">
            Bằng việc tham gia, bạn đồng ý chia sẻ thông tin liên hệ với những người trong lớp của bạn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteCodePage;
