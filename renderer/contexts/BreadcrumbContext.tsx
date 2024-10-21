/* eslint-disable no-unused-vars */
'use client';

import React, { createContext, useState, ReactNode } from 'react';

import { BreadcrumbItem } from '@/types';

const BreadcrumbContext = createContext({
  items: [] as BreadcrumbItem[],
  setItems: (_items: BreadcrumbItem[]) => {},
});

const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);

  return <BreadcrumbContext.Provider value={{ items, setItems }}>{children}</BreadcrumbContext.Provider>;
};

export { BreadcrumbContext, BreadcrumbProvider };
