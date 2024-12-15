import ProjectText from './ProjectText';

const ProjectTexts = ({ cur, projectColors }: { cur: { cur: number; prev: number }; projectColors: string[][] }) => {
  return (
    <>
      <ProjectText
        cur={cur}
        curKey={0}
        colors={projectColors}
        title="Classroom"
        desc="Google Classroom là một công cụ của Google giúp quản lý lớp học trực tuyến, phục vụ cho giáo viên và học sinh. Người dùng có thể tạo lớp học, giao bài tập, chấm điểm và tương tác trực tiếp với học sinh qua hệ thống này."
      />
      <ProjectText
        cur={cur}
        curKey={1}
        colors={projectColors}
        title="Moodle"
        desc="Moodle là một hệ thống quản lý học tập mã nguồn mở (LMS) được sử dụng rộng rãi để tạo các khóa học trực tuyến. Hệ thống này cung cấp các tính năng mạnh mẽ như tạo bài giảng, giao bài tập, đánh giá, theo dõi tiến độ học viên và nhiều tính năng hợp tác khác."
      />
      <ProjectText
        cur={cur}
        curKey={2}
        colors={projectColors}
        title="Courseroom"
        desc="Đây là một phần mềm chuyên biệt, tập trung vào việc quản lý nhóm, giao đồ án, và theo dõi tiến độ thực hiện được thiết kế dành riêng cho giảng viên và sinh viên trong các môn học có yêu cầu làm việc theo nhóm hoặc thực hiện đồ án."
      />
    </>
  );
};

export default ProjectTexts;
