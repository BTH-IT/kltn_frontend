'use client';

import { useState, useRef } from 'react';

import useIsomorphicLayoutEffect from '../gsap/UseIsomorphicLayoutEffect';
import { gsap, ScrollTrigger } from '../gsap/gsap';

import ProjectNav from './ProjectNav';
import ProjectsImages from './ProjectsImages';
import ProjectSides from './ProjectSides';
import ProjectTexts from './ProjectTexts';
import Title from './Title';

const Projects = () => {
  const [cur, setCur] = useState<{ prev: number; cur: number }>({
    prev: -1,
    cur: -1,
  });
  const projectCount = 3;
  const p = 100 / projectCount;
  const projectHeight = 350;

  const projectColors = [
    ['bg-neutral-300', 'bg-neutral-400', 'bg-neutral-600'],
    [
      'bg-[#9dffd0]',
      'bg-[#38f69a]',
      'bg-[#058d4b]',
      'text-[#10b465]',
      '[-webkit-text-stroke:2px_#32AC71] [text-stroke:2px_#32AC71]',
    ],
    [
      'bg-[#ffad64]',
      'bg-[#ff9334]',
      'bg-[#F47E17]',
      'text-[#ff7700]',
      '[-webkit-text-stroke:2px_#ff7700] [text-stroke:2px_#ff7700]',
    ],
    [
      'bg-[#7461f0]',
      'bg-[#361ed2]',
      'bg-[#200f8d]',
      'text-[#5C44F7]',
      '[-webkit-text-stroke:2px_#5C44F7] [text-stroke:2px_#5C44F7]',
    ],
    ['bg-neutral-300', 'bg-neutral-400', 'bg-neutral-600'],
  ];
  const el = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    gsap.context(() => {
      gsap.to('.images-container', {
        y:
          cur.cur === -1
            ? `${p + (projectCount % 2 === 0 ? p / 2 : 0)}%`
            : cur.cur === projectCount
              ? `-${p + (projectCount % 2 === 0 ? p / 2 : 0)}%`
              : `${p - cur.cur * p + (projectCount % 2 === 0 ? p / 2 : 0)}%`,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0,
      });
    }, el);
  }, [cur]);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.content-wrapper', {
        scrollTrigger: {
          trigger: '.content-wrapper',
          start: 'top top',
          end: `${projectCount * projectHeight}px top`,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        },
      });
      for (let i = 0; i < projectCount; i++) {
        ScrollTrigger.create({
          trigger: el.current,
          start: `${i * projectHeight}px top`,
          end: `+=${projectHeight}px top`,
          onEnter: () => {
            setCur({ prev: i - 1, cur: i });
          },
          onEnterBack: () => {
            setCur({ prev: i + 1, cur: i });
          },
          onLeaveBack: () => {
            i === 0 ? setCur({ prev: i, cur: i - 1 }) : null;
          },
          onLeave: () => {
            i === projectCount - 1 ? setCur({ prev: i, cur: i + 1 }) : null;
          },
        });
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="bg-[#F0F0F0] text-[#0E1016] pb-20 overflow-hidden">
      <div>
        <Title title="Các nền tảng khác so với ứng dụng" classes="projects-title !pb-0" />
      </div>
      <ProjectSides projectColors={projectColors} cur={cur.cur} projectCount={projectCount} />
      <div
        id="projects"
        className={'projects-section relative z-10 overflow-hidden'}
        style={{
          height: `${projectCount * projectHeight + projectHeight * 1.5}px`,
        }}
        ref={el}
      >
        <div className="absolute w-full h-full pointer-events-none">
          {Array.from(Array(projectCount), (e, i) => {
            return <div id={`project-${i}`} key={i} className="absolute" style={{ top: i * projectHeight }}></div>;
          })}
        </div>
        <div className="content-wrapper relative z-[-1] flex px-[6.5%]">
          <div className="flex h-[100svh] w-full items-center justify-center pb-[30svh] lg:justify-end lg:pr-[5%] lg:pb-0">
            <ProjectsImages cur={cur.cur} />
            <div className="absolute right-[5%] z-20 h-full">
              <ProjectNav
                colors={projectColors}
                curKey={cur.cur}
                projectCount={projectCount}
                projectHeight={projectHeight}
              />
            </div>
            <div className="pointer-events-none absolute top-0 left-0 flex h-full w-full items-start justify-center pt-[calc(49svh+4vw)] lg:items-center lg:justify-start lg:pt-0">
              <ProjectTexts cur={cur} projectColors={projectColors} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
