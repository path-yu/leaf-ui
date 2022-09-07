import { useEffect, useState } from 'react';

export function useIsFirstMount(depList: any[]) {
  let [isMount, setIsMount] = useState(false);
  useEffect(() => {
    if (depList.length === 0 || isMount) return;
    setIsMount(true);
  }, [depList]);
  return {
    isMount,
  };
}
