'use client';
import dynamic from 'next/dynamic';
import useBlobity from 'blobity/lib/react/useBlobity';
import { useEffect } from 'react';

import Hero from '@/components/landing/hero-section/Hero';
import PreLoader from '@/components/landing/animations/PreLoader/PreLoader';
import { initialBlobityOptions } from '@/libs/BlobityConfig';

const Work = dynamic(() => import('@/components/landing/work-section/Work'));
const Projects = dynamic(() => import('@/components/landing/project-section/Projects'));
const About = dynamic(() => import('@/components/landing/about-section/About'));
const Contact = dynamic(() => import('@/components/landing/contact-section/Contact'));
const Footer = dynamic(() => import('@/components/landing/footer/Footer'));

export default function Home() {
  const blobityInstance = useBlobity(initialBlobityOptions);

  useEffect(() => {
    if (blobityInstance.current) {
      // @ts-ignore for debugging purposes or playing around
      window.blobity = blobityInstance.current;
    }
  }, [blobityInstance]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);

  return (
    <div className={'overflow-x-hidden scroll-smooth font-mona-sans'}>
      <PreLoader />

      <main className="flex flex-col items-center justify-center">
        <Hero />
        <About />
        <Work />
      </main>
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}
