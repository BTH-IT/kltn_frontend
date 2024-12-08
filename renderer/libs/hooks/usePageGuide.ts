'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type StepsByPage = {
  [key: string]: any[];
};

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const usePageGuide = (stepsByPage: StepsByPage) => {
  const [steps, setSteps] = useState<any[]>([]); // Steps array
  const rawPathname = usePathname(); // Get current pathname

  useEffect(() => {
    if (!rawPathname) return;

    const uuids = rawPathname.split('/').filter((part) => !uuidRegex.test(part));
    const pathname = uuids.join('/').replace(/\/$/, '') || '/';

    const matchedSteps = stepsByPage[pathname] || [];
    setSteps(matchedSteps);
  }, [rawPathname, stepsByPage]);

  return { steps };
};

export default usePageGuide;
