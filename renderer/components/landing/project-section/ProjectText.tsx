'use client';

import { useRef } from 'react';

import useIsomorphicLayoutEffect from '../gsap/UseIsomorphicLayoutEffect';
import { gsap } from '../gsap/gsap';

const ProjectText = ({
  cur,
  curKey,
  title,
  desc,
  colors,
}: {
  cur: { cur: number; prev: number };
  curKey: number;
  title: string;
  desc: string;
  colors: any[];
}) => {
  const el = useRef<HTMLDivElement | null>(null);
  const el2 = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const titleAngle = Math.random() * 10 - 5;
    gsap.context(() => {
      if (cur.cur === curKey) {
        gsap.set('.project-title', {
          autoAlpha: 1,
          rotateZ: `${titleAngle}deg`,
          overwrite: true,
        });
        gsap.set('.project-description', {
          autoAlpha: 1,
          rotateZ: 'random(-5, 5)',
          overwrite: true,
        });
        gsap.set('.project-stack', {
          autoAlpha: 1,
          rotateZ: 'random(-5, 5)',
          overwrite: true,
        });
        gsap.set('.project-links', {
          autoAlpha: 1,
          rotateZ: 'random(-5, 5)',
          overwrite: true,
        });
        gsap.to('.project-title', {
          y: '0%',
          rotateZ: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: cur.cur > cur.prev ? 0.2 : 0.3,
        });
        gsap.to('.project-description', {
          y: '0%',
          rotateZ: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: cur.cur > cur.prev ? 0.35 : 0.4,
        });
        gsap.to('.project-stack', {
          y: '0%',
          rotateZ: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: cur.cur > cur.prev ? 0.4 : 0.3,
        });
        gsap.to('.project-links', {
          y: '0%',
          rotateZ: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: cur.cur > cur.prev ? 0.4 : 0.2,
        });
      } else {
        gsap.to('.project-title, .project-description, .project-stack, .project-links', {
          y: cur.cur > curKey ? '-200%' : '200%',
          duration: 1.2,
          ease: 'power3.out',
          overwrite: true,
          onComplete: () => {
            gsap.set('.project-title, .project-description, .project-stack, .project-links', {
              autoAlpha: 0,
            });
          },
        });
      }
    }, el);

    gsap.context(() => {
      if (cur.cur === curKey) {
        gsap.set('.project-title', {
          autoAlpha: 1,
          rotateZ: `${titleAngle}deg`,
          overwrite: true,
        });
        gsap.to('.project-title', {
          y: '0%',
          rotateZ: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: cur.cur > cur.prev ? 0.2 : 0.3,
        });
      } else {
        gsap.to('.project-title', {
          y: cur.cur > curKey ? '-200%' : '200%',
          duration: 1.2,
          ease: 'power3.out',
          overwrite: true,
          onComplete: () => {
            gsap.set('.project-title', {
              autoAlpha: 0,
            });
          },
        });
      }
    }, el2);
  }, [cur]);

  return (
    <>
      <div
        className="pointer-events-none absolute z-[-1] w-full max-w-5xl px-[6.5%] text-center lg:w-1/2 lg:text-start"
        ref={el2}
      >
        <div className="w-full overflow-hidden pb-1 text-[clamp(2.5rem,7.5vw+.1rem,15rem)] leading-[clamp(4rem,9vw+.1rem,15.5rem)] lg:w-fit">
          <div
            className={`project-title py-2 tracking-[0.025em] transition-colors duration-700 lg:whitespace-nowrap lg:py-3 ${
              colors[cur.cur + 1][3]
            }`}
          >
            {title}
          </div>
        </div>
        <div className="py-2 text-[1.5rem] opacity-0 lg:py-3">{desc}</div>
        <div className="h-6 my-2 opacity-0 lg:my-3"></div>
      </div>
      <div ref={el} className="absolute z-[2] w-full max-w-5xl px-[6.5%] text-center lg:w-1/2 lg:text-start">
        <div className="w-full overflow-hidden pb-1 text-[clamp(2.5rem,7.5vw+.1rem,15rem)] leading-[clamp(4rem,9vw+.1rem,15.5rem)] lg:w-fit">
          <div
            className={`project-title transition-[text-stroke,-webkit-text-stroke] duration-700 lg:whitespace-nowrap ${
              colors[cur.cur + 1][4]
            } py-2 tracking-[0.025em] text-transparent lg:py-3`}
          >
            {title}
          </div>
        </div>
        <div className="overflow-hidden text-[1.5rem]">
          <p className="py-2 project-description lg:py-3">{desc}</p>
        </div>
      </div>
    </>
  );
};

export default ProjectText;
