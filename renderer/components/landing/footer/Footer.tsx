import { motion } from 'framer-motion';

import AnimatedBody from '../animations/AnimatedBody';

const Footer = () => {
  return (
    <motion.section
      className=" h-[15vh] w-full  items-center justify-center border-t-2 border-[#e4ded7]/30 bg-[#0E1016] pt-10  font-bold uppercase md:h-[20vh] md:py-16 lg:h-[10vh] lg:pt-6 lg:pb-0"
      initial="initial"
      animate="animate"
    >
      <motion.div className="mx-auto flex w-[90%] flex-row items-center justify-between text-center text-[12px] text-[#e4ded7] sm:text-[12px] md:text-[14px] lg:max-w-[1440px] lg:text-[14px]">
        <AnimatedBody text={'Copyright 2024'} className={'m-0 p-0'} />
      </motion.div>
    </motion.section>
  );
};

export default Footer;
