import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const TooltipBottom = ({ children, content }: { children: React.ReactNode; content: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger type="button">{children}</TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipBottom;
