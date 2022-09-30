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

export interface ScrollBarProps {
  /**
   * @description 	显示滚动条的时机，none 表示一直显示
   * @default hover
   */
  trigger?: 'hover' | 'none' | 'scroll';
  /**
   * @description 显示水平滚动条
   * @default false
   */
  horizontal?: boolean;
  /**
   * @description 滚动的回调
   */
  onScroll?: (e: Event) => void;
  /**
   * @description 设置scrollbar容器style
   */
  style?: CSSProperties;
}
export interface ScrollBarExpose {
  //滚动到特定区域
  scrollTo?: (options: { left?: number; top?: number; behavior?: ScrollBehavior }) => Promise<any>;
}

const ScrollBar: ForwardRefRenderFunction<ScrollBarExpose, ScrollBarProps & PropsWithChildren> = (
  props,
  ref,
) => {
  let { children, horizontal = false, trigger = 'hover', style } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollbarRailRef = useRef<HTMLDivElement>(null);
  const scrollBarRailBarRef = useRef<HTMLDivElement>(null);
  const scrollType = useRef<'native' | 'moveBar'>('native');
  const computedSizeMap = useRef({
    scrollBarSize: 0,
    scrollbarRailSize: 0,
    averageScrollSize: 0,
    availableScrollSize: 0,
    scrollBarMaxMoveSize: 0,
    moveDiff: 0,
    contentMaxScrollSize: 0,
  });
  const show = useRef(trigger === 'none');
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (scrollType.current === 'native') {
      let { scrollTop } = e.currentTarget;
      let { averageScrollSize } = computedSizeMap.current;
      computedSizeMap.current.moveDiff = scrollTop / averageScrollSize;
      setScrollRailBarStyle();
    }
  };
  useImperativeHandle(ref, () => ({
    scrollTo(options) {
      return new Promise((resolve) => {});
    },
  }));

  useEffect(() => {
    initComputedSizeMap();
  });
  const { isClick } = useDragMove({
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
      let scrollToOption: ScrollToOptions = {};
      if (horizontal) {
        scrollToOption.left = scrollSize;
      } else {
        scrollToOption.top = scrollSize;
      }
      containerRef.current!.scrollTo(scrollToOption);
    },
    onEnd() {
      if (trigger === 'hover') {
        setTimeout(() => {
          show.current = false;
          setScrollRailBarStyle();
        }, 200);
      }
      scrollType.current = 'native';
    },
  });
  const initComputedSizeMap = () => {
    let container = containerRef.current as HTMLDivElement;
    let scrollbarRailEle = scrollbarRailRef.current!;
    let containerClientSize = horizontal ? container.clientWidth : container.clientHeight;
    let scrollSize = horizontal ? container.scrollWidth : container.scrollHeight;
    let scrollbarRailSize = horizontal
      ? scrollbarRailEle.clientWidth
      : scrollbarRailEle.clientHeight;
    let scrollBarSize = scrollbarRailSize * (scrollbarRailSize / scrollSize);
    let scrollBarMaxMoveSize = scrollbarRailSize - scrollBarSize;
    let availableScrollSize = scrollSize - scrollbarRailSize;
    if (availableScrollSize !== 0) {
      computedSizeMap.current = {
        scrollbarRailSize,
        scrollBarSize,
        availableScrollSize,
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
    if (!scrollbarRailBar && scrollBarSize === 0) return;
    scrollbarRailBar!.style.cssText = `${
      horizontal ? 'width' : 'height'
    }:${scrollBarSize}px;translate:${
      horizontal ? moveDiff + 'px' : '0 ' + moveDiff + 'px'
    };visibility:${show.current ? 'visible' : 'hidden'};opacity:${show.current ? 1 : 0} `;
  };

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
          bottom: ' 2px',
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
            if (isClick.current) return;
            show.current = false;
            setScrollRailBarStyle();
          },
        }
      : {};

  return (
    <div
      className={classNames('scrollbar', {
        'scrollbar-horizontal': horizontal,
      })}
      {...eventMaps}
    >
      <div className="scrollbar-container" onScroll={handleScroll} style={style} ref={containerRef}>
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
