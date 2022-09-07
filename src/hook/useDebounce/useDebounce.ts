import { useEffect, useRef } from 'react';

const debounce: DebounceFunc = (fn, wait) => {
  let timer: any = null;
  return function (...reset: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...reset);
    }, wait);
  };
};
interface DebounceFunc {
  (fn: Function, wait: number | undefined): any;
}
const useDebounce: DebounceFunc = (fn, wait = 300) => {
  const fnRef = useRef<Function>();
  // 页面首次渲染时利用ref保证防抖函数的唯一性
  useEffect(() => {
    fnRef.current = debounce(fn, wait);
  }, []);
  return {
    fnRef,
  };
};

export default useDebounce;
