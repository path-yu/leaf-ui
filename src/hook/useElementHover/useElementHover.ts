import { RefObject, useEffect, useRef, useState } from 'react';

export function useElementHover(target: RefObject<HTMLElement>) {
  const [isHover, setIsHover] = useState(false);
  const isHoverRef = useRef(false);
  const handleMouseEnter = () => {
    setIsHover(true);
    isHoverRef.current = true;
  };
  const handleMouseLeave = () => {
    setIsHover(false);
    isHoverRef.current = false;
  };
  useEffect(() => {
    target.current?.addEventListener('mouseenter', handleMouseEnter);
    target.current?.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      target.current?.removeEventListener('mouseenter', handleMouseEnter);
      target.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  });

  return {
    isHover,
    isHoverRef,
  };
}
