import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { imageAnimation, bodyAnimation } from '../animations/animations';
import AnimatedWords from '../animations/AnimatedWords';
import logo from '../../../public/images/logo-2.png';

const Hero = () => {
  return (
    <motion.section
      className="relative z-10 flex h-[80vh] w-full items-stretch justify-center bg-[url('.//../public/hero.jpg')] bg-cover  bg-center py-0 sm:h-[90vh]  md:h-[100vh]"
      id="home"
      initial="initial"
      animate="animate"
    >
      <motion.div className="absolute left-0 top-0 right-0 bottom-0 h-full w-full bg-[#0E1016] mix-blend-color"></motion.div>

      <div className="absolute top-8 flex justify-center sm:w-[90%] lg:max-w-[1440px]">
        <div>
          <Link
            href=""
            onClick={() => (window.location.href = '/login')}
            aria-label="Tham gia vào cuộc hành trình của tôi"
          >
            <motion.button
              className="hidden rounded-md border-2 border-[#e4ded7] py-2 px-4 text-[14px] font-semibold text-[#e4ded7] sm:block  md:text-[16px] lg:block"
              variants={bodyAnimation}
            >
              Khám phá ứng dụng
            </motion.button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center -mt-36 sm:-mt-20 lg:my-40 lg:-mt-2 lg:py-40 ">
        <div className={'relative flex flex-col items-center justify-center'}>
          <AnimatedWords
            title="COURSE ROOM"
            style="inline-block overflow-hidden pt-1 -mr-4 sm:-mr-5 md:-mr-7 lg:-mr-9 -mb-1 sm:-mb-2 md:-mb-3 lg:-mb-4"
          />
          <motion.div
            className="absolute bottom-[-110px] mx-auto sm:bottom-[-100px] md:bottom-[-130px] lg:bottom-[-150px]"
            variants={imageAnimation}
          >
            <Image
              src={logo}
              priority
              alt="Courseroom"
              data-blobity-tooltip="Courseroom"
              data-blobity-invert="false"
              className=" w-[150px] rounded-[16px] grayscale hover:grayscale-0 md:w-[200px] md:rounded-[32px] lg:w-[245px]"
            />
          </motion.div>
        </div>
      </div>

      <div
        className="absolute bottom-10 flex items-center 
      justify-center
      md:bottom-10 lg:w-[90%] lg:max-w-[1440px] lg:justify-between"
      >
        <motion.div className="  max-w-[350px] md:max-w-[400px] lg:max-w-[400px]" variants={bodyAnimation}>
          <p className="z-50 text-center text-[14px] font-medium text-[#e4ded7] md:text-[16px] lg:text-left text-shadow">
            Được xây dựng và thiết kế bởi <br />
            <Link
              href="https://facebook.com/BTH312003/"
              target="_blank"
              className="underline underline-offset-2 hover:no-underline text-[#5D45F8] font-bold  text-[20px]"
              aria-label="Biện Thành Hưng"
            >
              Biện Thành Hưng
            </Link>{' '}
            và{' '}
            <Link
              href="https://facebook.com/BTH312003/"
              target="_blank"
              className="underline underline-offset-2 hover:no-underline text-[#5940ff] font-bold text-[20px]"
              aria-label="Lê Tấn Minh Toàn"
            >
              Lê Tấn Minh Toàn
            </Link>
          </p>
        </motion.div>

        <motion.div className="  hidden max-w-[500px] lg:block lg:max-w-[420px]" variants={bodyAnimation}>
          <p className="text-right text-[14px] font-semibold text-[#e4ded7] md:text-[16px]">
            Với sự hướng dẫn tận tình của thầy <br />
            <Link
              href="https://facebook.com/BTH312003/"
              target="_blank"
              className="underline underline-offset-2 hover:no-underline text-[#5940ff] font-bold text-[20px]"
              aria-label="Nguyễn Tuấn Đăng"
            >
              Nguyễn Tuấn Đăng
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
