'use client';
import { ArrowLeftFromLine } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export function BackButton({ courseId, assignmentId }: { courseId: string; assignmentId: string }) {
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <ArrowLeftFromLine
            className="w-8 h-8 text-white cursor-pointer"
            onClick={() => {
              router.push(`/courses/${courseId}/assignments/${assignmentId}`);
            }}
          />
        </TooltipTrigger>
        <TooltipContent>Trở về trang trước</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
