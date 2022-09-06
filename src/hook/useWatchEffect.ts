import { useEffect, useRef, useState } from 'react';

type WatchEffectCallback<T> = (prev: T, current: T) => void | (() => void);
export function useWatchEffect<T>(target: T, effect: WatchEffectCallback<T>) {
  let state = useRef(target);
  useEffect(() => {
    let cleanup = effect(state.current, target);
    state.current = target;
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [target]);
}
