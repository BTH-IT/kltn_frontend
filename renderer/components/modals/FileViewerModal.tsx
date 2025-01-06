'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/libs/utils';
import { Attachment } from '@/types';

// Dynamically import react-file-viewer without SSR
const FileViewer = dynamic(() => import('react-file-viewer'), { ssr: false });

interface FileViewerModalProps {
  attachments: Attachment[];
  open?: boolean;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FileViewerModal({ attachments, open, onOpenChange }: FileViewerModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentAttachment, setCurrentAttachment] = React.useState<Attachment | null>(null);

  React.useEffect(() => {
    setCurrentIndex(0);
    setCurrentAttachment(attachments[currentIndex]);
  }, [attachments]);

  const filteredAttachments = attachments.filter(
    (attachment) =>
      attachment.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      attachment.description?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      true,
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < attachments.length - 1 ? prev + 1 : prev));
  };

  const handleAttachmentClick = (index: number) => {
    setCurrentIndex(index);
  };

  const modalContent = (
    <div className="flex h-[90vh] bg-background">
      <div className="flex flex-col flex-1">
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <div className="relative w-full max-w-3xl aspect-[4/3] mb-4">
            {currentAttachment ? (
              <FileViewer
                {...({
                  fileType: currentAttachment.url.split('.').pop() || '',
                  filePath: currentAttachment.url,
                  errorComponent: () => <div>Unable to display this file.</div>,
                  unsupportedComponent: () => <div>Unsupported file type.</div>,
                } as React.ComponentProps<typeof FileViewer>)}
              />
            ) : (
              <div>No attachment selected.</div>
            )}
          </div>
          <h1 className="mb-2 text-2xl font-bold">{currentAttachment?.title || ''}</h1>
          <p className="text-sm text-muted-foreground">{currentAttachment?.description || ''}</p>
        </div>

        <div className="p-4 border-t">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {attachments.length}
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handlePrev} disabled={currentIndex === 0}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Trước
                </Button>
                <Button variant="secondary" onClick={handleNext} disabled={currentIndex === attachments.length - 1}>
                  Sau <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="border-l w-80 bg-muted/10">
        <div className="p-4 border-b">
          <Input
            type="search"
            placeholder="Search"
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-auto h-[calc(100vh-65px)]">
          {filteredAttachments.map((attachment, index) => (
            <button
              key={index}
              onClick={() => handleAttachmentClick(index)}
              className={cn(
                'flex items-start gap-4 w-full p-4 hover:bg-muted/50 text-left',
                currentIndex === index && 'bg-muted',
              )}
            >
              <div className="flex-shrink-0 w-16 h-12 rounded bg-muted">
                <span>{attachment.title?.charAt(0) || ''}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{attachment.title}</p>
                <p className="text-sm truncate text-muted-foreground">{attachment.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (open !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 max-w-7xl">{modalContent}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Documents</Button>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-7xl">{modalContent}</DialogContent>
    </Dialog>
  );
}
