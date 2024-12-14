import Image from 'next/image';
import { motion } from 'framer-motion';

import TransitionLink from '@/app/presentation/_components/TransitionLink';

import '../animations/animate.css';
import AnimatedTitle from '../animations/AnimatedTitle';

const ImageClipBox = ({ src, clipClass }: any) => (
  <div className={clipClass}>
    <Image src={src} alt={src} width={400} height={1000} />
  </div>
);

const Contact = () => {
  return (
    <div id="contact" className="w-screen px-10 my-20 min-h-96">
      <div className="relative py-24 bg-black rounded-lg text-blue-50 sm:overflow-hidden">
        <div className="absolute top-0 hidden h-full overflow-hidden -left-20 w-72 sm:block lg:left-20 lg:w-96">
          <ImageClipBox src="/images/shared-image.png" clipClass="contact-clip-path-1 -top-3 absolute" />
          <ImageClipBox src="/images/login.png" clipClass="contact-clip-path-2 -bottom-1/2 absolute -translate-y-1/2" />
        </div>

        <div className="absolute mt-8 -translate-y-1/4 top-1/4 left-20 w-60 md:left-auto md:right-10 lg:w-80">
          <ImageClipBox src="/images/logo-2.png" clipClass="sword-man-clip-path" />
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="mb-10 font-general text-[16px] uppercase">Khám phá cùng chúng tôi</p>

          <AnimatedTitle
            text="Bắt đầu khám phá ngay"
            className={
              'mb-10 text-left text-[30px] font-bold leading-[1.2em] tracking-tighter text-[#e4ded7] sm:text-[35px] md:mb-16 md:text-[50px] lg:text-[70px]'
            }
            wordSpace={'mr-[14px]'}
            charSpace={'mr-[0.001em]'}
          />

          <TransitionLink href="/login" aria-label="Bắt đầu" target="_blank">
            <motion.button className="relative z-10 py-3 overflow-hidden text-black transition-transform duration-300 rounded-full cursor-pointer group w-fit bg-violet-50 px-7 hover:scale-105 hover:shadow-lg">
              Bắt đầu
            </motion.button>
          </TransitionLink>
        </div>
      </div>
    </div>
  );
};

export default Contact;
