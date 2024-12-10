/* eslint-disable quotes */
export type ProjectProps = {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  image: string;
};

export const devProjects = [
  {
    id: 0,
    name: 'Odunsi',
    description:
      'Portfolio website for Michael Odunsi, an experienced UI/UX designer crafting unique, user-friendly products and web experiences for Web3 founders and projects.',
    technologies: ['React', 'Tailwind CSS', 'Framer Motion'],
    image: require('../../../public/images/landing/nextjs.webp'),
  },
  {
    id: 1,
    name: 'Interlock',
    description:
      'This is a website for a Fintech Startup to showcase their innovative solutions tailored to meet the evolving needs of their clients.',
    technologies: ['React', 'Tailwind CSS', 'Framer Motion'],
    image: require('../../../public/images/landing/nextjs.webp'),
  },
  {
    id: 2,
    name: 'Synthetix',
    description:
      "Built specifically for an AI startup, this website lets them present cutting-edge AI data processing solutions tailored to their customers' needs.",
    technologies: ['React', 'Next.js', 'Prismic CMS'],
    image: require('../../../public/images/landing/nextjs.webp'),
  },
];
