import React, {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  CSSProperties,
  useRef,
  useImperativeHandle,
  useEffect,
  UIEvent,
  useMemo,
} from 'react';
import './scrollbar.scss';
import classNames from 'classnames';
import { useDragMove } from '../../hook';
import { throttle } from 'lodash';

export interface ScrollBarProps {
  /**
   * @description 	显示滚动条的时机，none 表示一直显示，scroll表示在滚动时显示
   * @default hover
   */
  trigger?: 'hover' | 'none' | 'scroll';
  /**
   * @description 显示水平滚动条
   * @default false
   */
  horizontal?: boolean;
  /**
   * @description 滚动的回调 e表示事件对象，scrollType表示触发滚动的类型，native为原始滚动，如鼠标滚轮，手指滑动操作，moveBar指拖拽滚动条触发的滚动
   */
  onScroll?: (e: UIEvent<HTMLDivElement>, scrollType: 'native' | 'moveBar') => void;
  /**
   * @description 设置scrollbar容器style
   */
  style?: CSSProperties;
  /**
   * @description 设置滚动条消失时间，单位ms，trigger为hover或者scroll有效
   * @default 1000ms
   */
  delayTime?: number;
}
export interface ScrollBarExpose {
  //滚动到特定区域
  scrollTo?: (
    options: { left?: number; top?: number; behavior?: ScrollBehavior },
    listener?: boolean,
  ) => null | Promise<unknown>;
}

const ScrollBar: ForwardRefRenderFunction<ScrollBarExpose, ScrollBarProps & PropsWithChildren> = (
  props,
  ref,
) => {
  let {
    children,
    horizontal = false,
    trigger = 'hover',
    style,
    delayTime = 1000,
    onScroll,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollbarRailRef = useRef<HTMLDivElement>(null);
  const scrollBarRailBarRef = useRef<HTMLDivElement>(null);
  const scrollType = useRef<'native' | 'moveBar'>('native');
  let timeId: any;
  const computedSizeMap = useRef({
    //滚动条大小 (高度或宽度)
    scrollBarSize: 0,
    // 滚动条滑道大小
    scrollbarRailSize: 0,
    // scrollTop与滚动条最大滚动距离的比例
    averageScrollSize: 0,
    // 滚动条最大移动距离
    scrollBarMaxMoveSize: 0,
    // 记录滚动条移动了多少距离
    moveDiff: 0,
    // 内容区最大滚动距离
    contentMaxScrollSize: 0,
  });
  const show = useRef(trigger === 'none');
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (scrollType.current === 'native') {
      let { scrollTop } = e.currentTarget;
      let { averageScrollSize } = computedSizeMap.current;
      computedSizeMap.current.moveDiff = scrollTop / averageScrollSize;
      if (horizontal) {
        moveDiff.current.x = computedSizeMap.current.moveDiff;
      } else {
        moveDiff.current.y = computedSizeMap.current.moveDiff;
      }
      if (trigger === 'scroll') {
        show.current = true;
        clearTimeout(timeId);
        timeId = setTimeout(() => {
          if (!isClick.current) {
            show.current = false;
            setScrollRailBarStyle();
          }
        }, delayTime);
      }
      setScrollRailBarStyle();
    }
    onScroll?.(e, scrollType.current);
  };
  useImperativeHandle(ref, () => {
    return {
      scrollTo,
    };
  });
  useEffect(() => {
    initComputedSizeMap();
    window.addEventListener('resize', throttleHandleResize);
    return () => {
      window.removeEventListener('resize', throttleHandleResize);
    };
  });
  const { isClick, moveDiff } = useDragMove({
    target: scrollBarRailBarRef,
    moveDirection: horizontal ? 'right' : 'bottom',
    reset: false,
    maxMoveDiff: () => computedSizeMap.current.scrollBarMaxMoveSize,
    onStart() {
      scrollType.current = 'moveBar';
    },
    onMove(diff) {
      let diffResult = horizontal ? diff.x : diff.y;
      computedSizeMap.current.moveDiff = diffResult;
      let { scrollBarMaxMoveSize, contentMaxScrollSize } = computedSizeMap.current;
      let scrollSize = Math.round((diffResult / scrollBarMaxMoveSize) * contentMaxScrollSize);
      let scrollToOption: ScrollToOptions = {
        [horizontal ? 'left' : 'top']: scrollSize,
      };
      scrollTo(scrollToOption);
    },
    onEnd() {
      if (trigger !== 'none') {
        setTimeout(() => {
          show.current = false;
          setScrollRailBarStyle();
        }, delayTime);
      }
      scrollType.current = 'native';
    },
  });
  const scrollTo = (options: ScrollToOptions, listener = false) => {
    if ((!options.top === undefined && !horizontal) || (!options.left === undefined && horizontal))
      return null;
    containerRef.current!.scrollTo(options);
    if (!listener) return null;
    const { top, left } = options;
    let moveScrollDiff = horizontal ? left : top;
    moveScrollDiff = Math.min(computedSizeMap.current.contentMaxScrollSize, moveScrollDiff!);
    let timer: any;
    const { current: containerEle } = containerRef;
    return new Promise((resolve) => {
      timer = setInterval(() => {
        let checkScrollSize = horizontal ? containerEle!.scrollLeft : containerEle!.scrollTop;
        if (checkScrollSize === moveScrollDiff) {
          resolve(true);
          clearInterval(timer);
        }
      }, 300);
    });
  };
  const sheepTick = () => {
    return new Promise((resolve) => setTimeout(resolve, 100));
  };
  const initComputedSizeMap = async () => {
    //等待一个tick，垂直方向scrollbarRailEle可能还没render完成,获取不到真实DOMSize
    await sheepTick();
    let container = containerRef.current as HTMLDivElement;
    let scrollbarRailEle = scrollbarRailRef.current!;

    let containerClientSize = horizontal ? container.clientWidth : container.clientHeight;
    let scrollSize = horizontal ? container.scrollWidth : container.scrollHeight;
    let scrollbarRailSize = horizontal
      ? scrollbarRailEle.clientWidth
      : scrollbarRailEle.clientHeight;
    let scrollBarSize = scrollbarRailSize * (scrollbarRailSize / scrollSize);
    let scrollBarMaxMoveSize = scrollbarRailSize - scrollBarSize;
    let availableScrollSize = scrollSize - containerClientSize;

    if (availableScrollSize !== 0) {
      computedSizeMap.current = {
        scrollbarRailSize,
        scrollBarSize,
        averageScrollSize: availableScrollSize / scrollBarMaxMoveSize,
        scrollBarMaxMoveSize: scrollbarRailSize - scrollBarSize,
        moveDiff: 0,
        contentMaxScrollSize: scrollSize - containerClientSize,
      };
    }
    if (trigger === 'none') {
      show.current = availableScrollSize !== 0;
    }
    setScrollRailBarStyle();
  };
  const setScrollRailBarStyle = () => {
    let { scrollBarSize, moveDiff } = computedSizeMap.current;
    let scrollbarRailBar = scrollBarRailBarRef.current;
    if (!scrollbarRailBar || scrollBarSize === 0) return;
    scrollbarRailBar!.style.cssText = `${
      horizontal ? 'width' : 'height'
    }:${scrollBarSize}px;translate:${
      horizontal ? moveDiff + 'px' : '0 ' + moveDiff + 'px'
    };visibility:${show.current ? 'visible' : 'hidden'};opacity:${show.current ? 1 : 0} `;
  };
  const throttleHandleResize = throttle(initComputedSizeMap, 300);

  const scrollbarRailStyle = useMemo<CSSProperties>(() => {
    return horizontal
      ? {
          left: '2px',
          right: ' 2px',
          bottom: ' 4px',
        }
      : {
          right: '4px',
          top: '2px',
          bottom: '2px',
          width: 'var(--scrollbar-width)',
        };
  }, []);
  let eventMaps =
    trigger === 'hover'
      ? {
          onMouseEnter: () => {
            show.current = true;
            setScrollRailBarStyle();
          },
          onMouseLeave: () => {
            show.current = false;
            if (isClick.current) return;
            setTimeout(setScrollRailBarStyle, delayTime);
          },
        }
      : {};

  return (
    <div
      className={classNames('scrollbar', {
        'scrollbar-horizontal': horizontal,
      })}
      {...eventMaps}
      style={style}
    >
      <div className="scrollbar-container" onScroll={handleScroll} ref={containerRef}>
        <div className="scrollbar-content">{children}</div>
      </div>
      <div className="scrollbar-rail" ref={scrollbarRailRef} style={scrollbarRailStyle}>
        <div
          className="scrollbar-rail_bar"
          ref={scrollBarRailBarRef}
          style={{ visibility: 'visible' }}
        />
      </div>
    </div>
  );
};

export default forwardRef(ScrollBar);
