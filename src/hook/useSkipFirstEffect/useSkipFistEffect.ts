import { DependencyList, useEffect, useRef } from 'react';

export function useSkipFistEffect(callback: () => void, deps: DependencyList | undefined = []) {
  let isMount = useRef(false);
  useEffect(() => {
    if (isMount.current) {
      callback();
    } else {
      isMount.current = true;
    }
  }, deps);
}
