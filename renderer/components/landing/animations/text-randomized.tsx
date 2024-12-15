/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

const lettersAndSymbols = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*-_+=;:<>,';

interface AnimatedTextProps {
  text: string;
}

export function RandomizedTextEffect({ text }: AnimatedTextProps) {
  const [animatedText, setAnimatedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const getRandomChar = useCallback(() => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)], []);

  const animateText = useCallback(async () => {
    const duration = 50;
    const revealDuration = 80;
    const initialRandomDuration = 300;

    const generateRandomText = () =>
      text
        .split('')
        .map(() => getRandomChar())
        .join('');

    setAnimatedText(generateRandomText());

    const endTime = Date.now() + initialRandomDuration;
    while (Date.now() < endTime) {
      await new Promise((resolve) => setTimeout(resolve, duration));
      setAnimatedText(generateRandomText());
    }

    for (let i = 0; i < text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, revealDuration));
      setAnimatedText(
        (prevText) =>
          text.slice(0, i + 1) +
          prevText
            .slice(i + 1)
            .split('')
            .map(() => getRandomChar())
            .join(''),
      );
    }
  }, [text, getRandomChar]);

  useEffect(() => {
    if (isVisible) animateText();
  }, [isVisible, animateText]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      const currentElementRef = elementRef.current;
      if (currentElementRef) {
        observer.unobserve(currentElementRef);
      }
    };
  }, []);

  return (
    <div ref={elementRef} className="relative inline-block">
      {animatedText}
    </div>
  );
}
