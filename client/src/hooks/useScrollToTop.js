import { useEffect } from 'react';

const useScrollToTop = (dependencies = []) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Smooth scrolling animation
    });
  }, dependencies);
};

export default useScrollToTop; 