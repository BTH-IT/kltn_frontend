import { IProject } from '@/types/project';
import http from '@/libs/http';
import { API_URL } from '@/constants/endpoints';
import { ProjectClient } from '@/components/tables/project-tables/client';

const ProjectsPage = async ({ params }: { params: { courseId: string } }) => {
  const {
    payload: { data: projects },
  } = await http.get<IProject[]>(`${API_URL.PROJECTS}/${params.courseId}`);

  return (
    <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
      <ProjectClient data={projects} />
    </div>
  );
};

export default ProjectsPage;
