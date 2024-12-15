/* eslint-disable quotes */
import '../animations/animate.css';
import AnimatedBody from '../animations/AnimatedBody';
import AnimatedTitle from '../animations/AnimatedTitle';

import AppCarousel from './AppCarousel';

const About = () => {
  return (
    <section
      className="relative z-10 w-full items-center justify-center overflow-hidden bg-[#0E1016] bg-cover bg-center pt-16 pb-36 md:pt-20 md:pb-44 lg:pt-20 lg:pb-56"
      id="about"
    >
      <div className="mx-auto flex w-[90%] flex-col items-center justify-center lg:max-w-[1212.8px]">
        <AnimatedTitle
          text={'Phần mềm trợ giúp giảng viên quản lý các nhóm đồ án môn học'}
          className={
            'mb-10 text-left text-[30px] font-bold leading-[1.2em] tracking-tighter text-[#e4ded7] sm:text-[35px] md:mb-16 md:text-[50px] lg:text-[70px]'
          }
          wordSpace={'mr-[14px]'}
          charSpace={'mr-[0.001em]'}
        />

        <div className="mx-auto flex w-[100%] flex-col lg:max-w-[1200px] lg:flex-row lg:gap-20">
          <div className="mb-10 flex w-[100%] flex-col gap-4 text-[18px] font-medium  leading-relaxed tracking-wide text-[#e4ded7] md:mb-16 md:gap-6 md:text-[20px] md:leading-relaxed lg:mb-16  lg:max-w-[90%] lg:text-[24px] ">
            <AnimatedBody
              text={
                'Đây là một phần mềm chuyên biệt, tập trung vào việc quản lý nhóm, giao đồ án, và theo dõi tiến độ thực hiện'
              }
            />
            <AnimatedBody
              text={
                'Được thiết kế dành riêng cho giảng viên và sinh viên trong các môn học có yêu cầu làm việc theo nhóm hoặc thực hiện đồ án'
              }
              className={'hidden'}
            />
            <AnimatedBody
              text={
                'Khác với các phần mềm quản lý dự án đa lĩnh vực, phần mềm này hướng đến nội dung và mục tiêu cụ thể, tạo ra một nền tảng chuyên biệt giúp giảng viên tối ưu hóa việc quản lý và đánh giá nhóm đồ án môn học'
              }
            />
            <AnimatedBody
              text={
                'Phần mềm hỗ trợ giảng viên quản lý hiệu quả nhóm sinh viên và đồ án môn học với nhiều tính năng nổi bật. Giảng viên có thể dễ dàng tạo nhóm sinh viên, giao đồ án kèm yêu cầu chi tiết và thiết lập các mốc thời gian cụ thể. Đồng thời, nhóm trưởng được phép mời thành viên và cập nhật trạng thái tham gia, giúp việc quản lý nhóm trở nên linh hoạt và chủ động hơn.'
              }
            />
            <AnimatedBody
              text={
                'Ngoài ra, phần mềm còn tích hợp không gian thảo luận và giao tiếp giữa các thành viên trong nhóm và với giảng viên, hỗ trợ lưu trữ, chia sẻ tài liệu nhóm. phần mềm còn có chức năng châm điểm ,hỗ trợ giảng viên tổng kết điểm theo các cột'
              }
            />
          </div>

          <div className="mb-24 flex w-[100%] flex-col gap-4 text-[18px] font-normal leading-relaxed tracking-wide text-[#e4ded7]/80 sm:mb-32 md:mb-40 md:gap-6 md:text-[16px] md:leading-normal lg:mt-0 lg:mb-16 lg:max-w-[30%] lg:text-[18px]">
            <div className="flex flex-col gap-4 md:gap-3">
              <AnimatedTitle
                text={'Frontend'}
                className={'text-[24px] text-[#e4ded7] md:text-[30px] lg:text-[20px]'}
                wordSpace={'mr-[0.25em]'}
                charSpace={'mr-[0.01em]'}
              />
              <AnimatedBody text={'NextJS 14, ShadcnUI, Tailwind CSS, Nextron, Framer Motion, GSAP.'} />
            </div>
            <div className="flex flex-col gap-3">
              <AnimatedTitle
                text={'Backend'}
                className={'text-[24px] text-[#e4ded7] md:text-[30px] lg:text-[20px]'}
                wordSpace={'mr-[0.25em]'}
                charSpace={'mr-[0.01em]'}
              />
              <AnimatedBody text={'ASP.NET, PostgreSQL'} />
            </div>
            <div className="flex flex-col gap-3">
              <AnimatedTitle
                text={'Tools'}
                className={'text-[24px] text-[#e4ded7] md:text-[30px] lg:text-[20px]'}
                wordSpace={'mr-[0.25em]'}
                charSpace={'mr-[0.01em]'}
              />
              <AnimatedBody text={'Figma, Visual Studio Code/Visual Studio, GitHub, AWS, Cloudinary.'} />
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-10 md:-mt-0 lg:mt-28">
          <AppCarousel />
          <AnimatedBody
            text="Các giao diện nhóm đã phát triển"
            className="absolute bottom-10 right-0 left-0 mx-auto w-[90%] text-center text-[14px] font-semibold uppercase text-[#e4ded7] sm:w-[500px] md:bottom-12 md:w-[550px] md:text-[16px] "
          />
        </div>
      </div>
    </section>
  );
};

export default About;
