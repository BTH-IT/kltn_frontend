import { useEffect } from 'react';
import { useAnimation, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type AnimatedBodyProps = {
  text: string;
  className?: string;
  wordSpace?: string;
  charSpace?: string;
};

export default function AnimatedBody({ text, className }: AnimatedBodyProps) {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    controls.start(inView ? 'visible' : 'hidden');
  }, [controls, inView]);

  const bodyAnimation = {
    hidden: {
      opacity: 0,
      y: '1em',
    },
    visible: {
      opacity: 1,
      y: '0em',
      transition: {
        delay: 0.1,
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  return (
    <motion.p
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={bodyAnimation}
      aria-label={text}
      role="heading"
      aria-hidden="true"
    >
      {text}
    </motion.p>
  );
}
