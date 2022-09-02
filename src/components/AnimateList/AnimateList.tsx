import React, {
  ReactNode,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  forwardRef,
  ForwardRefRenderFunction,
  CSSProperties,
  DragEvent,
  MutableRefObject,
  useState,
} from 'react';
import { animated, useTransition, UseTransitionProps } from '@react-spring/web';
import { useIsFirstMount } from '../../hook/useIsFirstMount';

interface AnimateListProps {
  /** 列表数据 */
  items: any[];
  /** 构建子项render函数 */
  buildItem: (item: any, index: number) => ReactNode;
  /**
   * @description 动画过渡时间, 单位ms
   * @default 300ms
   */
  duration?: number;
  /**
   * @description 过渡效果
   * @default collapse
   */
  effect?: 'slide-down' | 'collapse' | 'side-slide';
  /**
   * @description 提供每项唯一的key
   */
  keys: (item: any) => any;
  /**
   * @description slideDown从垂直方向落入或落下的移动距离
   * @default 50
   */
  slideDownDistance?: number;
  /**
   * @description sideSlide过渡从水平滑入或离开的距离
   * @default 100
   */
  sideSlideDistance?: number;
  /**
   * @description 初始渲染是否开启过渡
   * @default false
   */
  appear?: boolean;
  /**
   * @description 列表顺序变化时开启flip动画
   * @default true
   */
  enableFlip?: boolean;
  /**
   * 子项包裹元素额外style
   */
  wrapItemStyle?: CSSProperties;
  /**
   * @description 拖拽交换数据setState
   */
  dropSwap?: (data: { dropIndex: number; originIndex: number; newList: any[] }) => void;
  /**
   * @description 拖拽交换数据触发的事件类型, 默认是onDragEnter, 可选onDrop
   * @default enter
   */
  dragSwapEventType?: 'enter' | 'drop';
  /**
   * @description 触发flip动画过渡曲线, 默认ease-in
   * @default ease-in
   */
  flipEasing?: string;
  /**
   * @description 开启拖拽切换锚点子元素map
   */
  dragAbleTargetElementMap?: MutableRefObject<Map<any, HTMLElement>>;
  /**
   * @description 进入拖拽元素触发回调
   */
  dragEnter?: (event: DragEvent) => void;
  /**
   * @description 将元素放置有效拖拽区触发
   */
  drop?: (event: DragEvent) => void;
  /**
   * @description 拖拽开始回调
   */
  dropStart?: (event: DragEvent, startIndex: number) => void;
}
export interface AnimateListExpose {
  setLastBoundRect: () => void;
}
const AnimateList: ForwardRefRenderFunction<AnimateListExpose, AnimateListProps> = (props, ref) => {
  const {
    items,
    buildItem,
    duration = 300,
    effect = 'collapse',
    keys,
    slideDownDistance = 50,
    sideSlideDistance = 100,
    appear = false,
    enableFlip = true,
    wrapItemStyle = {},
    dropSwap,
    dragSwapEventType = 'enter',
    flipEasing = 'ease-in',
    dragAbleTargetElementMap,
    dragEnter,
    drop,
    dropStart,
  } = props;
  const refMap = useMemo(() => new Map(), []);
  const wrapRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<Map<HTMLElement, DOMRect>>(new Map());
  const prevItems = useRef<any[]>([...items]);
  const originIndex = useRef<number | null>(null);
  const [dragAble, setDragAble] = useState(false);
  const { isMount } = useIsFirstMount(items);
  const enterSwapLock = useRef(false);
  useImperativeHandle(ref, () => {
    return {
      setLastBoundRect,
    };
  });
  useEffect(() => {
    prevItems.current = items;
  }, [items]);
  useLayoutEffect(() => {
    if (prevItems.current.length !== items.length || !enableFlip) return;
    triggerFlip();
  }, [items]);
  useEffect(() => {
    let targetElementMap = dragAbleTargetElementMap?.current;
    targetElementMap &&
      targetElementMap.forEach((node) => {
        if (!node) return;
        node.onmousedown = handleDragAbleTargetMouseDown;
        node.addEventListener('mousedown', handleDragAbleTargetMouseDown);
      });
    return () => {
      targetElementMap &&
        targetElementMap.forEach((node) => {
          if (!node) return;
          node.removeEventListener('mousedown', handleDragAbleTargetMouseDown);
        });
    };
  }, [items]);
  const handleDragAbleTargetMouseDown = (event: MouseEvent) => {
    event.stopPropagation();
    setDragAble(true);
  };
  const triggerFlip = () => {
    let currentRectMap = createELeRectMap(wrapRef.current!);
    lastRef.current.forEach((preNodeRect, node) => {
      let currentRect = currentRectMap.get(node) as DOMRect;
      if (!currentRect) return;
      let invert = {
        top: preNodeRect.top - currentRect.top,
        left: preNodeRect.left - currentRect.left,
      };
      let keyframes = [
        { transform: `translate(${invert.left}px,${invert.top}px)` },
        { transform: 'translate(0,0)' },
      ];
      node.animate(keyframes, {
        duration,
        easing: flipEasing,
      });
    });
  };
  const createELeRectMap = (wrapNode: HTMLElement) => {
    let childNode = Array.from(wrapNode.childNodes) as HTMLElement[];
    return new Map(childNode.map((node) => [node, node.getBoundingClientRect()]));
  };
  let collapseProps: UseTransitionProps = {
    from: () => {
      let from = { opacity: 0, height: 0 };
      if (appear) {
        return from;
      } else {
        return isMount ? from : {};
      }
    },
    enter: (item) => async (next) => {
      await next({ opacity: 1, height: getRealHeight(item), y: 0 });
    },
    leave: { opacity: 0, height: 0 },
  };
  let slideDown: UseTransitionProps = {
    from: () => {
      let from = { opacity: 0, y: -slideDownDistance, height: 0 };
      if (appear) {
        return from;
      } else {
        return isMount ? from : {};
      }
    },
    enter: (item) => async (next) => {
      await next({ opacity: 1, height: getRealHeight(item), y: 0 });
    },
    leave: { opacity: 0, y: -slideDownDistance, height: 0 },
  };
  const sideSlideProps: UseTransitionProps = {
    from: () => {
      let from = { opacity: 0, x: -sideSlideDistance, height: 0 };
      if (appear) {
        return from;
      } else {
        return isMount ? from : {};
      }
    },
    enter: (item) => async (next) => {
      await next({ opacity: 1, height: getRealHeight(item), x: 0 });
    },
    leave: { opacity: 0, x: sideSlideDistance, height: 0 },
  };
  let effectProps = {
    'slide-down': slideDown,
    collapse: collapseProps,
    'side-slide': sideSlideProps,
  };

  const getRealHeight = (item: any) => refMap.get(item).scrollHeight;
  const transitions = useTransition(items, {
    ...effectProps[effect],
    config: {
      duration,
    },
    keys,
  });
  let resetOpacityEffect: Function;
  const setLastBoundRect = () => {
    lastRef.current = createELeRectMap(wrapRef.current!);
  };
  const filterOriginDrop = (newIndex: number) => {
    return newIndex === originIndex.current || originIndex.current === null;
  };
  const handleDragStart = (event: DragEvent, i: number) => {
    originIndex.current = i;
    let currentTarget = event.currentTarget as HTMLElement;
    currentTarget.style.transition = `opacity ${duration} ${flipEasing}`;
    setTimeout(() => {
      currentTarget.style.opacity = '0.5';
    });
    resetOpacityEffect = () => {
      currentTarget.style.opacity = '1';
      currentTarget.style.transition = '';
    };
    dropStart?.(event, i);
  };
  let swapList = (newIndex: number, oldIndex: number) => {
    let list = [...items];
    let temp = list[oldIndex];
    list[oldIndex] = list[newIndex];
    list[newIndex] = temp;
    return list;
  };
  const triggerSwap = (index: number) => {
    enableFlip && setLastBoundRect();
    if (dropSwap) {
      let origin = originIndex.current!;
      dropSwap({
        originIndex: origin,
        dropIndex: index,
        newList: swapList(index, origin),
      });
    }
    if (dragSwapEventType === 'enter') {
      originIndex.current = index;
      enterSwapLock.current = true;
      setTimeout(() => {
        enterSwapLock.current = false;
      }, duration);
    } else {
      originIndex.current = null;
    }
  };
  const handleDragEnter = (event: DragEvent, i: number) => {
    if (!filterOriginDrop(i) && !enterSwapLock.current) {
      dragSwapEventType === 'enter' && triggerSwap(i);
      dragEnter?.(event);
    }
    resetOpacityEffect?.();
  };
  const handleDrop = (event: DragEvent, i: number) => {
    event.preventDefault();
    if (!filterOriginDrop(i)) {
      dragSwapEventType === 'drop' && triggerSwap(i);
      drop?.(event);
    }
    setDragAble(false);
    resetOpacityEffect?.();
  };
  return (
    <div ref={wrapRef}>
      {transitions((style, item, o, i) => {
        return (
          <animated.div
            draggable={dragAble}
            className="drag-item"
            ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
            style={{ ...style, ...wrapItemStyle }}
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={(ev) => ev.preventDefault()}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnter={(e) => handleDragEnter(e, i)}
          >
            {buildItem(item, i)}
          </animated.div>
        );
      })}
    </div>
  );
};
export default forwardRef(AnimateList);
