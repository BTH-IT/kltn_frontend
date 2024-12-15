// @ts-nocheck
'use client';
import React, { useEffect, useId, useState } from 'react';
import { XIcon } from 'lucide-react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import Image from 'next/image';

interface IMediaModal {
  imgSrc?: string;
  videoSrc?: string;
  className?: string;
}
const transition = {
  type: 'spring',
  duration: 0.4,
};
// eslint-disable-next-line no-unused-vars
export function MediaModal({ imgSrc, videoSrc, className }: IMediaModal) {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const uniqueId = useId();

  useEffect(() => {
    if (isMediaModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMediaModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMediaModalOpen]);
  return (
    <>
      <MotionConfig transition={transition}>
        <>
          <motion.div
            // @ts-ignore
            className="relative flex flex-col w-full h-full overflow-hidden bg-gray-300 border cursor-pointer dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-950"
            layoutId={`dialog-${uniqueId}`}
            onClick={() => {
              setIsMediaModalOpen(true);
            }}
          >
            {imgSrc && (
              <motion.div layoutId={`dialog-img-${uniqueId}`} className="w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                  src={imgSrc}
                  alt="File/Link preview"
                  className="object-contain w-full h-full"
                  width={800}
                  height={800}
                />
              </motion.div>
            )}
            {videoSrc && (
              <motion.div layoutId={`dialog-video-${uniqueId}`} className="w-full h-full">
                <video autoPlay muted loop className="object-cover w-full h-full rounded-sm">
                  <source src={videoSrc!} type="video/mp4" />
                </video>
              </motion.div>
            )}
          </motion.div>
        </>
        <AnimatePresence initial={false} mode="sync">
          {isMediaModalOpen && (
            <>
              <motion.div
                key={`backdrop-${uniqueId}`}
                className="fixed inset-0 z-10 w-full h-full dark:bg-black/25 bg-white/95 backdrop-blur-sm"
                variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={() => {
                  setIsMediaModalOpen(false);
                }}
              />
              <motion.div
                key="dialog"
                className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  className="pointer-events-auto relative flex flex-col overflow-hidden   dark:bg-gray-950 bg-gray-200 border w-[80%] h-[90%] "
                  layoutId={`dialog-${uniqueId}`}
                  tabIndex={-1}
                  style={{
                    borderRadius: '24px',
                  }}
                >
                  {imgSrc && (
                    <motion.div layoutId={`dialog-img-${uniqueId}`} className="w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <Image src={imgSrc} alt="" width={800} height={800} className="object-contain w-full h-full" />
                    </motion.div>
                  )}
                  {videoSrc && (
                    <motion.div layoutId={`dialog-video-${uniqueId}`} className="w-full h-full">
                      <video autoPlay muted loop controls className="object-cover w-full h-full rounded-sm">
                        <source src={videoSrc!} type="video/mp4" />
                      </video>
                    </motion.div>
                  )}

                  <button
                    onClick={() => setIsMediaModalOpen(false)}
                    className="absolute p-3 bg-gray-400 rounded-full cursor-pointer right-6 top-6 text-zinc-50 dark:bg-gray-900 hover:bg-gray-500 dark:hover:bg-gray-800"
                    type="button"
                    aria-label="Close dialog"
                  >
                    <XIcon size={24} />
                  </button>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </MotionConfig>
    </>
  );
}
