import { DependencyList, MutableRefObject, RefObject, useEffect, useRef } from 'react';
import { isMobile } from '../../utils/core/isMobile';
import { getEventClientPosition } from '../../utils/core/getEventClientPosition';
import { sleep } from '../../utils/core/sleep';

let _isMobile = isMobile();
export function useDragMove(options: DragMoveOptions) {
  let timerId: any;
  let isClick = useRef(false);
  let moveIng = useRef(false);
  let touchPosition = useRef({ x: 0, y: 0 });
  let moveDiff = useRef({ x: 0, y: 0 });
  const {
    target,
    reset = true,
    onMove,
    moveDirection = 'around',
    onEnd,
    onStart,
    threshold,
    activeThreshold,
    maxMoveDiff,
    activeTransition = true,
    transition = 'all 0.3s linear',
    originTranslate = {
      x: 0,
      y: 0,
    },
    deps = [],
    asyncDelay = 0,
    autoBindEvent = true,
  } = options;
  const isHorizontal =
    moveDirection === 'horizontal' || moveDirection === 'left' || moveDirection === 'right';
  const isVertical =
    moveDirection === 'vertical' || moveDirection === 'top' || moveDirection === 'bottom';
  const handleMouseDownOrTouchStart = (e: MouseEvent | TouchEvent) => {
    isClick.current = true;
    let { x, y } = getEventClientPosition(e);
    touchPosition.current = { x, y };
    target.current!.style.transition = 'none';
    onStart?.(e);
  };
  const handleMouseMoveOrTouchMove = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isClick.current) return;
    let { x, y } = getEventClientPosition(e);
    let { x: moveX, y: moveY } = moveDiff.current;
    if (
      maxMoveDiff &&
      moveDirection === 'around' &&
      (Math.abs(moveX) >= maxMoveDiff || Math.abs(moveY) >= maxMoveDiff)
    )
      return;
    moveDiff.current.x += x - touchPosition.current.x;
    moveDiff.current.y += y - touchPosition.current.y;
    if (
      (moveDirection === 'left' && moveDiff.current.x > 0) ||
      (moveDirection === 'right' && moveDiff.current.x < 0)
    ) {
      moveDiff.current.x = 0;
    }
    if (
      (moveDirection === 'top' && moveDiff.current.y > 0) ||
      (moveDirection === 'bottom' && moveDiff.current.y < 0)
    ) {
      moveDiff.current.y = 0;
    }
    let absMoveX = Math.abs(moveDiff.current.x);
    let absMoveY = Math.abs(moveDiff.current.y);
    if (maxMoveDiff && absMoveX > maxMoveDiff) {
      moveDiff.current.x = moveDiff.current.x > 0 ? maxMoveDiff : -maxMoveDiff;
    }
    if (maxMoveDiff && absMoveY > maxMoveDiff) {
      moveDiff.current.y = moveDiff.current.y > 0 ? maxMoveDiff : -maxMoveDiff;
    }
    moveEle();
    onMove?.({ x: moveDiff.current.x, y: moveDiff.current.y }, e);
    checkThreshold();
    touchPosition.current = { x, y }; //更新上一次鼠标移动后的x和y坐标
    moveIng.current = true;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      moveIng.current = false;
    }, 10);
  };
  const handleMouseUpOrTouchEnd = (e: MouseEvent | TouchEvent) => {
    if (!isClick.current) return;
    isClick.current = false; //鼠标抬起或手指抬起后赋值为false
    setTargetTransition();
    if (reset) {
      resetRef();
    }
    onEnd?.(e);
  };
  const setTargetTransition = () => {
    target.current && (target.current!.style.transition = transition);
  };
  const checkThreshold = () => {
    let distanceX = Math.abs(moveDiff.current.x);
    let distanceY = Math.abs(moveDiff.current.y);
    if (threshold) {
      if (isHorizontal && distanceX >= threshold) {
        activeThreshold?.();
        activeTransition && setTargetTransition();
      }
      if (isVertical && distanceY >= threshold) {
        activeThreshold?.();
        activeTransition && setTargetTransition();
      }
      if ((moveDirection === 'around' && distanceX >= threshold) || distanceY >= threshold) {
        activeThreshold?.();
        activeTransition && setTargetTransition();
      }
    }
  };
  const resetRef = () => {
    moveDiff.current = { x: 0, y: 0 };
    touchPosition.current = { x: 0, y: 0 };
    moveEle();
  };
  const moveEle = () => {
    let ele = target.current as HTMLElement;
    let { x: diffX, y: diffY } = moveDiff.current;
    let moveX = originTranslate.x + diffX;
    let moveY = originTranslate.y + diffY;
    if (!ele) return;
    if (moveDirection === 'around') {
      ele.style.transform = `translate(${moveX}px,${moveY}px)`;
    } else if (isHorizontal) {
      ele.style.transform = `translate(${moveX}px,${originTranslate.y}px)`;
    } else if (isVertical) {
      ele.style.transform = `translate(${originTranslate.y}px,${moveY}px)`;
    }
  };
  useEffect(() => {
    return bindEventEffect();
  }, deps);
  const bindEventEffect = () => {
    sleep(asyncDelay).then(() => {
      if (!target?.current) return;
      if (_isMobile) {
        autoBindEvent &&
          target.current?.addEventListener('touchstart', handleMouseDownOrTouchStart);
        autoBindEvent && target.current?.addEventListener('touchmove', handleMouseMoveOrTouchMove);
        autoBindEvent && target.current?.addEventListener('touchend', handleMouseUpOrTouchEnd);
      } else {
        window.addEventListener('mousemove', handleMouseMoveOrTouchMove);
        window.addEventListener('mouseup', handleMouseUpOrTouchEnd);
        target.current?.addEventListener('mousedown', handleMouseDownOrTouchStart);
      }
    });
    return () => {
      if (_isMobile) {
        target.current?.removeEventListener('touchstart', handleMouseDownOrTouchStart);
        target.current?.removeEventListener('touchmove', handleMouseMoveOrTouchMove);
        target.current?.removeEventListener('touchend', handleMouseUpOrTouchEnd);
      } else {
        window.removeEventListener('mousemove', handleMouseMoveOrTouchMove);
        window.removeEventListener('mouseup', handleMouseUpOrTouchEnd);
        target.current?.removeEventListener('mousedown', handleMouseDownOrTouchStart);
      }
    };
  };
  return {
    moveIng,
    moveDiff,
    handleMouseDownOrTouchStart,
    handleMouseMoveOrTouchMove,
    handleMouseUpOrTouchEnd,
  };
}
export interface DragMoveOptions {
  /** 目标绑定元素 */
  target: RefObject<HTMLElement>;
  /**
   * @description 鼠标抬起或手指抬起是否重置移动距离
   * @default true
   */
  reset?: boolean;
  /** 拖拽移动中触发 */
  onMove?: (moveDiff: { x: number; y: number }, e: TouchEvent | MouseEvent) => void;
  /** 鼠标抬起或手指抬起 */
  onEnd?: (e: TouchEvent | MouseEvent) => void;
  /** 鼠标在目标元素按下或手指按下触发 */
  onStart?: (e: TouchEvent | MouseEvent) => void;
  /**
   * @description 拖拽方向，支持水平，垂直，上下左右，或者任意方向拖拽，默认around，即不限制方向
   * @default around
   */
  moveDirection?: 'horizontal' | 'vertical' | 'around' | 'top' | 'left' | 'right' | 'bottom';
  /** 设置移动阈值, 当达到阈值触发回调 */
  threshold?: number;
  /** 移动中达到阈值触发回调 */
  activeThreshold?: () => void;
  /** 最大移动距离 */
  maxMoveDiff?: number;
  /** 达到阈值开启transition，默认拖拽开始会关闭transition，结束时开启transition */
  activeTransition?: boolean;
  /** 设置目标元素的transition */
  transition?: string;
  /** 目标元素如果设置translate，添加此参数传入原始的translateX，translateY */
  originTranslate?: {
    x: number;
    y: number;
  };
  /**
   * @description useEffect依赖数组
   * @default []
   */
  deps?: DependencyList;
  /**
   * @description 当目标ref是一个需要异步加载的组件时，需要的等待时间
   */
  asyncDelay?: number;
  /**
   * @description 是否自动绑定DOM事件
   * @default true;
   */
  autoBindEvent?: boolean;
}
export interface DragMoveResult {
  /** 记录当前是否正在拖着中的ref */
  moveIng: MutableRefObject<boolean>;
  /** 记录当前移动的距离 */
  moveDiff: MutableRefObject<{ x: number; y: number }>;
  /** 鼠标按下或者手指按下事件，默认会自动绑定，也可以手动绑定，pc只需要绑定onMouseDown为此回调即可 */
  handleMouseDownOrTouchStart: (e: MouseEvent | TouchEvent) => void;
  /** 鼠标移动或者手指移动事件，pc端默认绑定在window上，不需要手动绑定，移动端可以手动绑定onTouchMove事件 */
  handleMouseMoveOrTouchMove: (e: MouseEvent | TouchEvent) => void;
  /** 鼠标抬起或者手指抬起事件，pc端默认绑定在window上，移动端可以手动绑定到onTouchEnd事件 */
  handleMouseUpOrTouchEnd: (e: MouseEvent | TouchEvent) => void;
}
