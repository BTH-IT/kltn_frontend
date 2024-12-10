'use client';

import { useContext } from 'react';

import { GuideContext } from '@/contexts/GuideContext';

import usePageGuide from './usePageGuide';

const stepsByPage = {
  '/': [
    {
      content: (
        <h2>
          Chào mừng bạn đến với Courseroom được phát triển từ nhóm sinh viên
          <br />
          <strong>Biện Thành Hưng và Lê Tấn Minh Toàn</strong> <br /> dưới sự hướng dẫn của thầy <br />
          <strong>Nguyễn Tuấn Đăng</strong>
        </h2>
      ),
    },
    {
      content: 'Đây là nút phóng to thu nhỏ thanh sidebar kèm phần hiển thị đường dẫn điều hướng',
      selector: '.home-step-1',
    },
    {
      content: 'Đây là nơi để thêm lớp học mới, tham gia lớp học qua mã lớp hoặc đăng xuất khỏi hệ thống',
      selector: '.home-step-2',
    },
    {
      content: 'Đây là thanh sidebar chứa các mục điều hướng chính của hệ thống như màn hình chính, lớp học, v.v.',
      selector: '.home-step-3',
    },
    {
      content: 'Đây là nơi hiển thị các lớp học bạn đã tham gia hoặc do bạn tạo',
      selector: '.home-step-5',
    },
  ],
  '/courses': [
    {
      content: 'Đây là nút phóng to thu nhỏ thanh sidebar kèm phần hiển thị đường dẫn điều hướng',
      selector: '.home-step-1',
    },
    {
      content: 'Đây là nơi để thêm lớp học mới, tham gia lớp học qua mã lớp hoặc đăng xuất khỏi hệ thống',
      selector: '.home-step-2',
    },
    {
      content: 'Đây là thanh sidebar chứa các mục điều hướng chính của hệ thống như màn hình chính, lớp học, v.v.',
      selector: '.home-step-3',
    },
    {
      content: 'Đây là thanh điều hướng qua các trang của lớp học',
      selector: '.course-step-4',
    },
    {
      content: 'Đây là nơi hiển thị các thông tin lớp học và đăng bài mới',
      selector: '.course-step-5',
    },
  ],
  '/courses/people': [
    {
      content: 'Đây là nơi hiển thị thông tin sinh viên và thêm/xóa sinh viên',
      selector: '.people-step-1',
    },
  ],
  '/courses/assignments': [
    {
      content: 'Đây là nơi hiển thị các bài tập của lớp học',
      selector: '.assignments-step-1',
    },
  ],
  '/courses/projects': [
    {
      content: 'Đây là nơi hiển thị các đồ án/tiểu luận gồm đồ án và nhóm của lớp học',
      selector: '.projects-step-1',
    },
  ],
  '/groups': [
    {
      content: 'Đây là nơi hiển thị thông tin nhóm và các thành viên trong nhóm',
      selector: '.groups-step-1',
    },
  ],
  '/courses/scores': [
    {
      content: 'Đây là nơi hiển thị thông tin bảng điểm và thông tin sinh viên',
      selector: '.scores-step-1',
    },
  ],
  '/settings': [
    {
      content: 'Đây là nơi để xem và thay đổi thông tin cá nhân',
      selector: 'body',
    },
    {
      content: 'Đây là nút phóng to thu nhỏ thanh sidebar kèm phần hiển thị đường dẫn điều hướng',
      selector: '.home-step-1',
    },
    {
      content: 'Đây là nơi để xem hướng dẫn hoặc đăng xuất khỏi hệ thống',
      selector: '.home-step-2',
    },
    {
      content: 'Đây là thanh sidebar chứa các mục điều hướng chính của hệ thống như màn hình chính, lớp học, v.v.',
      selector: '.home-step-3',
    },
    {
      content: 'Đây là thanh điều hướng tới trang cài đặt thông tin cá nhân hoặc thay đổi mật khẩu',
      selector: '.setting-step-4',
    },
    {
      content: 'Đây là nơi để thay đổi thông tin cá nhân',
      selector: '.setting-step-5',
    },
  ],
};

const useGuide = () => {
  const { isShow, setGuide, setSteps } = useContext(GuideContext);
  const { steps } = usePageGuide(stepsByPage);

  const showGuide = () => {
    setSteps(steps);
    setGuide(true);
  };

  const hideGuide = () => {
    setGuide(false);
  };

  return {
    isShow,
    showGuide,
    hideGuide,
    steps,
    setSteps,
    setGuide,
  };
};

export default useGuide;
