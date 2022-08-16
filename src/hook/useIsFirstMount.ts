import { useEffect, useState } from 'react';

export function useIsFirstMount() {
  let [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  return {
    isMount,
  };
}
