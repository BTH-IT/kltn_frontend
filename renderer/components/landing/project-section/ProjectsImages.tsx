'use client';

import Image from 'next/image';
import { useRef, useContext, useState } from 'react';

import useIsomorphicLayoutEffect from '../gsap/UseIsomorphicLayoutEffect';
import { gsap } from '../gsap/gsap';
import { SmoothScrollContext } from '../gsap/SmoothScroll.context';

const transform = 'lg:[transform:perspective(2000px)_skewX(-10deg)_rotateY(-25deg)_]';

const ProjectImage = ({
  cur,
  selfId,
  src,
  fallbackImgSrc,
}: {
  cur: number;
  selfId: number;
  src: string;
  fallbackImgSrc: string;
}) => {
  const el = useRef<HTMLDivElement | null>(null);
  const { scroll } = useContext(SmoothScrollContext);
  const [imgSrc, setImgSrc] = useState<string>(src);

  useIsomorphicLayoutEffect(() => {
    gsap.context(() => {
      if (cur === selfId) {
        gsap.to(el.current, { scale: 1.1, duration: 1, ease: 'power2.out' });
        gsap.to('.project-image', {
          scale: 1,
          duration: 1,
          ease: 'power2.out',
        });
        gsap.to('.project-image', {
          css: { filter: 'grayscale(0%)', '-webkit-filter': 'grayscale(0%)' },
          duration: 1,
          ease: 'power2.out',
        });
      } else {
        gsap.to(el.current, { scale: 0.85, duration: 1, ease: 'power2.out' });
        gsap.to('.project-image', {
          scale: 1.5,
          duration: 1,
          ease: 'power2.out',
        });
        gsap.to('.project-image', {
          css: {
            filter: 'grayscale(100%)',
            '-webkit-filter': 'grayscale(100%)',
          },
          duration: 1,
          ease: 'power2.out',
        });
      }
    }, el);
  }, [cur]);

  return (
    <div
      className={`relative z-[1] mx-auto aspect-[16/13] w-[85%] cursor-pointer overflow-hidden rounded-md transition-opacity duration-1000 lg:w-[90%] xl:w-full lg:rounded-none ${
        cur === selfId ? 'opacity-100' : 'opacity-0 lg:opacity-100'
      } ${(selfId === 0 && cur === -1) || (selfId === 3 && cur === 4) ? '!opacity-100' : ''}`}
      ref={el}
      onClick={() => scroll.scrollTo(scroll.offset(`#project-${selfId}`, '200px'), true)}
    >
      <Image
        src={imgSrc}
        alt="project1"
        className="object-cover w-full h-full scale-110 project-image"
        onError={() => setImgSrc(fallbackImgSrc)}
        fill
        sizes="(min-width: 1024px) 100vw, 100vw"
      ></Image>
    </div>
  );
};

const ProjectMask = ({ cur, selfId }: { cur: number; selfId: number }) => {
  const el = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (cur === selfId) {
      gsap.to(el.current, { scale: 1.1, duration: 1, ease: 'power2.out' });
    } else {
      gsap.to(el.current, { scale: 0.85, duration: 1, ease: 'power2.out' });
    }
  }, [cur]);

  return (
    <div className="pointer-events-none relative aspect-[16/13] w-full" ref={el}>
      <svg viewBox="0 0 16 13" className="absolute top-[-4%] left-[-5%] h-[110%] w-[110%] fill-[#F0F0F0]">
        <path d="M0 1.5Q8 1 16 1.5V0H0ZM0 12Q8 11.5 16 12V13H0Z" />
      </svg>
    </div>
  );
};

const ProjectsImages = ({ cur }: { cur: number }) => {
  const el = useRef<HTMLDivElement | null>(null);
  const { isLarge } = useContext(SmoothScrollContext);

  useIsomorphicLayoutEffect(() => {
    if (!isLarge) return;
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
    });
    const ctx = gsap.context(() => {
      tl.to(
        '.images-wrapper',
        {
          y: '-=15',
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
          duration: 3,
        },
        0,
      );
      tl.to(
        '.images-mask',
        {
          y: '-=15',
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
          duration: 3,
        },
        0,
      );
    }, el);

    return () => {
      tl.kill();
      ctx.kill();
    };
  }, [isLarge]);

  return (
    <div
      className={`relative h-full w-[calc(200px+35%)] min-w-[325px] ${transform} pointer-events-none lg:pointer-events-auto`}
      ref={el}
    >
      <div className="flex items-center w-full h-full">
        <div className="w-full images-container h-fit will-change-transform">
          <div className="flex flex-col w-full images-wrapper h-fit will-change-transform">
            <ProjectImage
              cur={cur}
              selfId={0}
              src={'/images/google-classroom.jpg'}
              fallbackImgSrc={'/images/google-classroom.jpg'}
            />
            <ProjectImage cur={cur} selfId={1} src={'/images/moodle.jpg'} fallbackImgSrc={'/images/moodle.jpg'} />
            <ProjectImage
              cur={cur}
              selfId={2}
              src={'/images/shared-image.png'}
              fallbackImgSrc={'/images/shared-image.png'}
            />
            <div className="absolute top-0 left-0 z-10 flex-col hidden w-full h-full pointer-events-none images-mask will-change-transform lg:flex">
              <ProjectMask cur={cur} selfId={0} />
              <ProjectMask cur={cur} selfId={1} />
              <ProjectMask cur={cur} selfId={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsImages;
