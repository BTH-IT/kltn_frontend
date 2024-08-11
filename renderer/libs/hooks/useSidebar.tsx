import { useState } from 'react';

export const useSidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  return {
    isMinimized,
    toggle: () => setIsMinimized((state) => !state),
  };
};
