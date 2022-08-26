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
   */
  enableFlip?: boolean;
  /**
   * 子项包裹元素额外style
   */
  wrapItemStyle?: CSSProperties;
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
  } = props;
  const refMap = useMemo(() => new Map(), []);
  const wrapRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<Map<HTMLElement, DOMRect>>(new Map());
  const prevItems = useRef<any[]>([...items]);
  const { isMount } = useIsFirstMount();

  useImperativeHandle(ref, () => {
    return {
      setLastBoundRect() {
        lastRef.current = createELeRectMap(wrapRef.current!);
      },
    };
  });
  useEffect(() => {
    prevItems.current = items;
  }, [items]);
  useLayoutEffect(() => {
    if (prevItems.current.length !== items.length || !enableFlip) return;
    triggerFlip();
  }, [items]);
  const triggerFlip = () => {
    let currentRectMap = createELeRectMap(wrapRef.current!);
    lastRef.current.forEach((preNodeRect, node) => {
      let currentRect = currentRectMap.get(node) as DOMRect;
      console.log(currentRect, preNodeRect);
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
        easing: 'linear',
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
    enter: (item) => async (next, cancel) => {
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
  return (
    <div ref={wrapRef}>
      {transitions((style, item, o, i) => {
        return (
          // @ts-ignore
          <animated.div
            ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
            style={{ ...style, ...wrapItemStyle }}
          >
            {buildItem(item, i)}
          </animated.div>
        );
      })}
    </div>
  );
};

export default forwardRef(AnimateList);
