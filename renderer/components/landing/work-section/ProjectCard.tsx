/* eslint-disable quotes */
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import AnimatedTitle from '../animations/AnimatedTitle';
import AnimatedBody from '../animations/AnimatedBody';

import { ProjectProps } from './projectDetails';

const ProjectCard = ({ id, name, description, technologies, image }: ProjectProps) => {
  return (
    <motion.div
      style={
        {
          backgroundColor: '#212531',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          position: 'relative',
        } as React.CSSProperties
      }
      className={`relative z-10 h-[550px]  w-full items-stretch justify-center overflow-hidden rounded-3xl bg-center py-0 sm:h-[700px] sm:w-[100%] md:h-[650px] md:w-[100%] lg:h-[500px]`}
      initial="initial"
      animate="animate"
    >
      <Image
        src={image}
        alt={name}
        className={`absolute -bottom-2 w-[70%] sm:w-[85%] md:w-[60%] lg:max-w-[55%] ${
          id % 2 === 0 ? 'right-0' : 'left-0'
        }`}
      />
      <div
        className={`absolute text-white  ${
          !(id % 2 === 0)
            ? 'right-0 top-32 mr-0 ml-10 md:right-0 md:ml-0 lg:right-0 lg:top-60  lg:mr-4'
            : 'left-10 top-32 ml-0 md:mr-12 lg:top-52 lg:ml-4'
        } mb-10  md:mb-16 lg:mb-14 `}
      >
        <AnimatedTitle
          text={name}
          className={
            'max-w-[90%] text-[40px] leading-none text-white md:text-[44px] md:leading-none lg:max-w-[450px] lg:text-[48px] lg:leading-none'
          }
          wordSpace={'mr-[0.25em]'}
          charSpace={'-mr-[0.01em]'}
        />
        <AnimatedBody
          text={description}
          className={'mt-4 w-[90%] max-w-[457px] text-[16px] font-semibold text-[#95979D] '}
        />
        <div className="flex gap-4 mt-9">
          {technologies.map((tech, id) => (
            <AnimatedTitle
              text={tech}
              wordSpace={'mr-[0.25em]'}
              charSpace={'mr-[0.01em]'}
              key={id}
              className={'text-[14px] font-bold uppercase md:text-[16px] lg:text-[18px] '}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
