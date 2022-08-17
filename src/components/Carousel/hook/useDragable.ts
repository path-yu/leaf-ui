import React, {
  RefObject,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from 'react';
import { isMobile } from '../../../utils/core/isMobile';

let _isMobile = isMobile();
export function useDragAble(data: {
  target: RefObject<HTMLElement>;
  threshold: number;
  direction: 'horizontal' | 'vertical';
  toggleNext: (effectFn?: () => void) => void;
  togglePrev: (effectFn?: () => void) => void;
  duration?: number;
  loop: boolean;
}) {
  const { target, threshold, direction, toggleNext, togglePrev, duration = 300, loop } = data;
  let trigger = useRef(false);
  let mouseOrTouchPosition = useRef({ x: 0, y: 0 });
  let moveDiff = useRef({ x: 0, y: 0 });
  let startTranslate = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  let originStyle = useRef<string | null>(null);

  const handleTriggerStart = (event: ReactTouchEvent | ReactMouseEvent) => {
    // 过滤指示点点击
    event.stopPropagation();
    let { x, y } = getEventClientPosition(event);
    mouseOrTouchPosition.current = { x, y };
    trigger.current = true;
    originStyle.current = target.current!.style.cssText;
    // 拖拽过程 消除过渡
    target.current!.style.transitionDuration = '';
    const matchTranslateX = target.current!.style.transform.match(/translateX\((-?\d+)px\)/);
    const matchTranslateY = target.current!.style.transform.match(/translateY\((-?\d+)px\)/);
    if (direction === 'horizontal') {
      startTranslate.current.x = +matchTranslateX![1] as number;
    } else {
      startTranslate.current.y = +matchTranslateY![1] as number;
    }
  };
  useEffect(() => {
    !_isMobile && document.body.addEventListener('mousemove', handleTriggerMove);
    !_isMobile && document.body.addEventListener('mouseup', handleTriggerEnd);
    return () => {
      !_isMobile && document.body.removeEventListener('mousemove', handleTriggerMove);
      !_isMobile && document.body.removeEventListener('mouseup', handleTriggerEnd);
    };
  }, []);
  const handleTriggerMove = (event: ReactTouchEvent | MouseEvent) => {
    event.stopPropagation();
    if (!_isMobile) {
      event.preventDefault();
    }
    if (!trigger.current) return;
    let { x, y } = getEventClientPosition(event);
    moveDiff.current.x += x - mouseOrTouchPosition.current.x;
    moveDiff.current.y += y - mouseOrTouchPosition.current.y;
    moveEle();
    mouseOrTouchPosition.current = { x, y }; //更新上一次鼠标移动后的x和y坐标
  };

  const handleTriggerEnd = (event: ReactTouchEvent | MouseEvent) => {
    event.stopPropagation();
    if (!trigger.current) return;
    target.current!.style.transition = '';
    validateRebound();
    resetData();
  };
  const validateRebound = () => {
    if (direction === 'horizontal' && moveDiff.current.x !== 0) {
      //回弹
      if (Math.abs(moveDiff.current.x)) {
        reboundEle();
        console.log('reset');
      }
    }
  };
  const resetData = () => {
    trigger.current = false;
    moveDiff.current = { x: 0, y: 0 };
    mouseOrTouchPosition.current = { x: 0, y: 0 };
  };
  const getEventClientPosition = (event: any) => {
    let x, y;
    if (!_isMobile) {
      x = (event as MouseEvent).clientX;
      y = (event as MouseEvent).clientY;
    } else {
      x = (event as TouchEvent).touches[0].clientX;
      y = (event as TouchEvent).touches[0].clientY;
    }
    return {
      x,
      y,
    };
  };
  const reboundEle = () => {
    target.current!.style.cssText =
      (originStyle.current as string) + ` transition-duration: ${duration}ms`;
  };
  const moveEle = () => {
    //水平移动
    if (direction === 'horizontal') {
      let x = moveDiff.current.x;
      let startTranslateX = startTranslate.current.x!;
      // 向右
      if (x > 0) {
        // 达到阈值 切换下一张
        if (x >= threshold) {
          target.current!.style.transitionDuration = '';
          togglePrev(reboundEle);
          resetData();
        } else {
          let moveX = startTranslateX + x;
          // 移动dom
          target.current!.style.transform = `translateX(${moveX}px)`;
        }
      } else {
        // 向左
        if (Math.abs(x) >= threshold) {
          target.current!.style.transitionDuration = '';
          toggleNext(reboundEle);
          resetData();
        } else {
          let moveX = startTranslateX - Math.abs(x);
          target.current!.style.transform = `translateX(${moveX}px)`;
        }
      }
    }
  };
  if (_isMobile) {
    return {
      onTouchStart: handleTriggerStart,
      onTouchMove: handleTriggerMove,
      onTouchEnd: handleTriggerEnd,
    };
  } else {
    return {
      onMouseDown: handleTriggerStart,
    };
  }
}
