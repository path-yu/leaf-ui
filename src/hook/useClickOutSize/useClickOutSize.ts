import { RefObject, useEffect, useState } from 'react';
export function useClickOutSize(ref: RefObject<HTMLElement>, handler: Function) {
  let [targetIsClick, setTargetIstClick] = useState(false);
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        setTargetIstClick(true);
        return;
      }
      handler(event);
      setTargetIstClick(false);
    };
    document.addEventListener('click', listener);
    return () => {
      document.removeEventListener('click', listener);
    };
  }, []);
  return {
    targetIsClick,
  };
}
