/* eslint-disable quotes */
export type ProjectProps = {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  image: string;
};

export const devProjects = [
  {
    id: 0,
    name: 'NEXT.JS',
    description:
      'Chúng tôi chọn Next.js vì tính linh hoạt cao, dễ phát triển và cộng đồng hỗ trợ mạnh mẽ, giúp giảm thời gian phát triển và tối ưu hóa trải nghiệm người dùng.',
    technologies: ['Xu thế', 'Tối ưu SEO', 'Hỗ trợ SSR/SSG'],
    image: require('../../../public/images/landing/nextjs.webp'),
  },
  {
    id: 1,
    name: 'ASP.NET',
    description:
      'ASP.NET được chọn vì hiệu năng cao, dễ bảo trì và khả năng mở rộng, rất phù hợp với các ứng dụng doanh nghiệp lớn và các hệ thống yêu cầu bảo mật cao.',
    technologies: ['Hiệu năng cao', 'Dễ bảo trì', 'Bảo mật'],
    image: require('../../../public/images/landing/asp.webp'),
  },
  {
    id: 2,
    name: 'MySQL',
    description:
      'MySQL được ưa chuộng vì tính ổn định, hiệu suất cao và khả năng xử lý dữ liệu phức tạp, đặc biệt là trong các ứng dụng AI và phân tích dữ liệu.',
    technologies: ['Tính mở rộng cao', 'Dữ liệu phức tạp', 'Ổn định'],
    image: require('../../../public/images/landing/sql.webp'),
  },
];
