import { useEffect } from 'react';
import { useAnimation, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type AnimatedTitleProps = {
  text: string;
  className: string;
  wordSpace: string;
  charSpace: string;
  delay?: number;
};

const AnimatedTitle = ({ text, className, wordSpace, charSpace, delay = 0 }: AnimatedTitleProps) => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    controls.start(inView ? 'visible' : 'hidden');
  }, [controls, inView]);

  const characterAnimation = {
    hidden: { opacity: 0, y: '0.25em' },
    visible: {
      opacity: 1,
      y: '0em',
      transition: { duration: 1, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  const renderWord = (word: string, wordIndex: number) => (
    <motion.span
      ref={ref}
      key={wordIndex}
      initial="hidden"
      animate={controls}
      variants={{ hidden: {}, visible: {} }}
      transition={{
        delayChildren: delay + wordIndex * 0.25,
        staggerChildren: 0.05,
      }}
      className={`inline-block whitespace-nowrap ${wordSpace}`}
    >
      {word.split('').map((char, charIndex) => (
        <motion.span
          key={charIndex}
          variants={characterAnimation}
          className={`inline-block ${charSpace}`}
          aria-hidden="true"
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );

  return (
    <h2 aria-label={text} role="heading" className={className}>
      {text.split(' ').map(renderWord)}
    </h2>
  );
};

export default AnimatedTitle;
