import { useEffect, useRef } from 'react';
const debounce = (fn, wait) => {
    let timer = null;
    return function (...reset) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...reset);
        }, wait);
    };
};
const useDebounce = (fn, wait = 300) => {
    const fnRef = useRef();
    // 页面首次渲染时利用ref保证防抖函数的唯一性
    useEffect(() => {
        fnRef.current = debounce(fn, wait);
    }, []);
    return {
        fnRef,
    };
};
export default useDebounce;
