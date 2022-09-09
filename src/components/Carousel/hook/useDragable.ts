import {
  RefObject,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from 'react';
import { isMobile } from '../../../utils/core/isMobile';
import { getEventClientPosition } from '../../../utils/core/getEventClientPosition';

let _isMobile = isMobile();
export function useDragAble(data: {
  target: RefObject<HTMLElement>;
  getThreshold: () => number;
  direction: 'horizontal' | 'vertical';
  toggleNext: () => void;
  togglePrev: () => void;
  duration?: number;
  enable: boolean;
}) {
  const {
    target,
    getThreshold,
    direction,
    toggleNext,
    togglePrev,
    duration = 300,
    enable = false,
  } = data;
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
    !_isMobile && enable && document.body.addEventListener('mousemove', handleTriggerMove);
    !_isMobile && enable && document.body.addEventListener('mouseup', handleTriggerEnd);
    return () => {
      !_isMobile && enable && document.body.removeEventListener('mousemove', handleTriggerMove);
      !_isMobile && enable && document.body.removeEventListener('mouseup', handleTriggerEnd);
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
    let threshold = getThreshold();
    if (
      direction === 'horizontal' &&
      moveDiff.current.x !== 0 &&
      Math.abs(moveDiff.current.x) < threshold
    ) {
      //回弹
      reboundEle();
    }
    if (
      direction === 'vertical' &&
      moveDiff.current.y !== 0 &&
      Math.abs(moveDiff.current.y) < threshold
    ) {
      reboundEle();
    }
  };
  const resetData = () => {
    trigger.current = false;
    moveDiff.current = { x: 0, y: 0 };
    mouseOrTouchPosition.current = { x: 0, y: 0 };
  };
  const reboundEle = () => {
    target.current!.style.cssText =
      (originStyle.current as string) + ` transition-duration: ${duration}ms`;
  };
  const moveEle = () => {
    let threshold = getThreshold();
    let moveDist = direction === 'horizontal' ? moveDiff.current.x : moveDiff.current.y;
    let startTranslateDist =
      direction === 'horizontal' ? startTranslate.current.x! : startTranslate.current.y!;
    let translatePosition = direction === 'horizontal' ? 'x' : 'y';
    //向右滑动或向上
    if (moveDist > 0) {
      // 达到阈值 切换下一张
      if (moveDist >= threshold) {
        target.current!.style.transitionDuration = '';
        togglePrev();
        resetData();
      } else {
        target.current!.style.transform = `translate${translatePosition}(${
          startTranslateDist + moveDist
        }px)`;
      }
    } else {
      // 向左或向下
      if (Math.abs(moveDist) >= threshold) {
        target.current!.style.transitionDuration = '';
        toggleNext();
        resetData();
      } else {
        target.current!.style.transform = `translate${translatePosition}(${
          startTranslateDist - Math.abs(moveDist)
        }px)`;
      }
    }
  };
  if (!enable) return {};
  if (_isMobile) {
    return {
      onTouchStart: handleTriggerStart,
      onTouchMove: handleTriggerMove,
      onTouchEnd: handleTriggerEnd,
      reboundEle,
    };
  } else {
    return {
      onMouseDown: handleTriggerStart,
      reboundEle,
    };
  }
}
