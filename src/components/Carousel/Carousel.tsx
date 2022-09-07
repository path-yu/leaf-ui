import React, {
  PropsWithChildren,
  Children,
  useState,
  useEffect,
  useRef,
  CSSProperties,
  ReactNode,
  cloneElement,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from 'react';
import cssStyle from './Carousel.module.scss';
import classNames from 'classnames';
import { useElementHover } from '../../hook';
import { useDragAble } from './hook/useDragable';
import { CarouselExpose } from './Api/CarouselMethods.api';
export interface CarouselProps {
  /**
   * @description 是否自动播放
   * @default false
   */
  autoplay?: boolean;
  /**
   * @description 面板指示点位置，可选 top bottom left right
   * @default bottom
   */
  dotPosition?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * @description 轮播图显示的方向
   * @default horizontal
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * @description 指示点样式
   * @default dot
   */
  dotType?: 'dot' | 'line';
  /**
   * @description 默认显示页
   * @default 0
   */
  defaultIndex?: number;
  /**
   * @description 自动播放的间隔（ms）
   * @default 2000
   */
  interval?: number;
  /**
   * @description 是否通过鼠标拖拽切换轮播图
   * @default false
   */
  draggable?: boolean;
  /**
   * @description 是否展示指示点
   * @default true
   */
  showDots?: boolean;
  /**
   * @description 轮播图切换时的过渡效果
   * @default slide
   */
  effect?: 'slide' | 'fade';
  /**
   * @description 指示点触发切换的方式
   * @default click
   */
  trigger?: 'click' | 'hover';
  /**
   * @description 当前页更新的回调
   */
  onChange?: (currentIndex: number, prevIndex: number) => void;
  /**
   * @description 是否循环播放，类似无缝轮播
   * @default true
   */
  loop?: boolean;
  /**
   * @description 轮播图宽度，默认100%
   * @default 100%
   */
  width?: string;
  /**
   * @description 轮播图宽度，默认根据子元素高度设置，可不传
   * @default 100%
   */
  height?: string;
  /**
   * @description 拖拽切换阈值比例，基于轮播图宽度，默认0.5
   * @default 0.5
   */
  thresholdRatio?: number;
  /**
   * @description 过渡时间 单位ms
   * @default 300
   */
  duration?: number;
}
const Carousel: ForwardRefRenderFunction<CarouselExpose, CarouselProps & PropsWithChildren> = (
  props,
  ref,
) => {
  const {
    children,
    defaultIndex = 0,
    autoplay = false,
    dotPosition = 'bottom',
    direction = 'horizontal',
    dotType = 'dot',
    interval = 2000,
    loop = true,
    trigger = 'click',
    showDots = true,
    effect = 'slide',
    draggable = false,
    onChange,
    width = '100%',
    height = '100%',
    thresholdRatio = 0.5,
    duration = 300,
  } = props;
  let _defaultIndex = defaultIndex!;
  let childrenCount = Children.count(children);
  const [current, setCurrent] = useState<number>(_defaultIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesEleRef = useRef<HTMLDivElement>(null);
  const containerSize = useRef({ width: 0, height: 0 });
  const [containerHeight, setContainerHeight] = useState(height !== '100%' ? height : '0');
  let autoPlayMode = useRef<'reverse' | 'order'>(
    current === childrenCount - 1 ? 'reverse' : 'order',
  );
  const [slidesStyle, setSlidesStyle] = useState<CSSProperties>({});
  const dotPositionIsHorizontal = dotPosition === 'top' || dotPosition === 'bottom';
  const { isHoverRef } = useElementHover(containerRef);
  const dotStyle: () => CSSProperties = () => {
    if (dotPositionIsHorizontal) {
      let css: CSSProperties = {
        transform: 'translateX(-50%)',
        display: 'flex',
        left: '50%',
      };
      if (dotPosition === 'bottom') {
        css.bottom = '12px';
      } else {
        css.top = '12px';
      }
      return css;
    } else {
      let css: CSSProperties = {
        transform: 'translateY(-50%)',
        top: '50%',
      };
      if (dotPosition === 'left') {
        css.left = '12px';
      } else {
        css.right = '12px';
      }
      return css;
    }
  };

  useEffect(() => {
    let slideRefEle = slidesEleRef.current as HTMLDivElement;
    let realHeight = slideRefEle.children[0].scrollHeight;
    containerSize.current = {
      width: slideRefEle.children[0].scrollWidth,
      height: slideRefEle.children[0].scrollHeight,
    };
    setCurrent(_defaultIndex!);
    if (height === '100%') {
      setContainerHeight(realHeight + 'px');
    }
    toggleSlideTransitionDuration(false);
    updateSlidesStyle(loop ? _defaultIndex + 1 : _defaultIndex);
    let timer: any;
    // 开启自动播放
    if (autoplay) {
      timer = setInterval(startAutoPlay, interval);
    }
    return () => {
      timer = null;
      clearInterval(timer);
    };
  }, []);
  useImperativeHandle(ref, () => {
    return {
      next: () => toggleNext(),
      prev: () => togglePrev(),
      getCurrentIndex: () => current,
      to: (index) => toCurrent(index),
    };
  });

  const toCurrent = (index: number) => {
    if (index < 0 || index >= childrenCount) return;
    effect === 'slide' && toggleSlideTransitionDuration(true);
    setCurrent(index);
    if (loop) {
      updateSlidesStyle(index + 1);
    } else {
      updateSlidesStyle(index);
    }
    onChange?.(index, current);
  };
  const toggleNext = () => {
    effect === 'slide' && toggleSlideTransitionDuration(true);
    if (loop) {
      toggleLoopNext();
    } else {
      toggleOriginalNext();
    }
  };
  const togglePrev = (effectFn?: () => void) => {
    effect === 'slide' && toggleSlideTransitionDuration(true);
    if (loop) {
      toggleLoopPrev();
    } else {
      toggleOriginalPrev();
    }
  };
  const toggleLoopNext = () => {
    setCurrent((prev) => {
      let resultIndex = prev === childrenCount - 1 ? 0 : prev + 1;
      if (prev === childrenCount - 1) {
        updateSlidesStyle(childrenCount + 1);
        setTimeout(() => {
          //关闭过渡，切换到原始位置
          toggleSlideTransitionDuration(false);
          updateSlidesStyle(1);
        }, duration);
      } else {
        updateSlidesStyle(resultIndex + 1);
      }
      onChange?.(resultIndex, prev);
      return resultIndex;
    });
  };
  const toggleLoopPrev = () => {
    setCurrent((prev) => {
      let resultIndex = prev === 0 ? childrenCount - 1 : prev - 1;
      if (prev === 0) {
        updateSlidesStyle(0);
        setTimeout(() => {
          toggleSlideTransitionDuration(false);
          updateSlidesStyle(childrenCount);
        }, duration);
      } else {
        updateSlidesStyle(prev);
      }
      onChange?.(resultIndex, prev);
      return resultIndex;
    });
  };
  const toggleOriginalNext = () => {
    setCurrent((prev) => {
      let isEnd = prev === childrenCount - 1;
      isEnd && reboundEle?.();
      let resultIndex = isEnd ? prev : prev + 1;
      prev !== resultIndex && onChange?.(resultIndex, prev);
      updateSlidesStyle(resultIndex);
      return resultIndex;
    });
  };
  const toggleOriginalPrev = () => {
    setCurrent((prev) => {
      let isFirst = prev === 0;
      isFirst && reboundEle?.();
      let resultIndex = isFirst ? 0 : prev - 1;
      prev !== resultIndex && onChange?.(resultIndex, prev);
      updateSlidesStyle(resultIndex);
      return resultIndex;
    });
  };

  let { reboundEle, ...eventMaps } = useDragAble({
    target: slidesEleRef,
    getThreshold: () => containerSize.current?.width * thresholdRatio!,
    direction,
    toggleNext,
    togglePrev,
    enable: effect === 'slide' && draggable,
  });
  const dotEvent = (index: number) => {
    return trigger === 'click'
      ? {
          onClick: () => toCurrent(index),
        }
      : {
          onMouseEnter: () => toCurrent(index),
        };
  };
  const updateSlidesStyle = (index: number) => {
    let style: CSSProperties = {};
    if (effect === 'slide') {
      if (direction === 'horizontal') {
        style = { transform: `translateX(-${index * containerSize.current.width}px)` };
      } else {
        style = { transform: `translateY(-${index * containerSize.current.height}px)` };
      }
      setSlidesStyle(style);
    }
  };
  const toggleSlideTransitionDuration = (enable = true) => {
    let slideEle = slidesEleRef.current as HTMLDivElement;
    slideEle && (slideEle.style.transitionDuration = enable ? `${duration}ms` : '');
  };
  const startAutoPlay = () => {
    effect === 'slide' && toggleSlideTransitionDuration(true);
    if (isHoverRef.current) return;
    if (loop) {
      toggleLoopNext();
    } else {
      setCurrent((prev) => {
        if (prev === 0) {
          autoPlayMode.current = 'order';
        }
        if (prev === childrenCount - 1) {
          autoPlayMode.current = 'reverse';
        }
        let resultIndex = autoPlayMode.current === 'order' ? prev! + 1 : prev! - 1;
        updateSlidesStyle(resultIndex);
        onChange?.(resultIndex, prev);
        return resultIndex;
      });
    }
  };
  const wrapChild = (child: ReactNode, index?: number) => {
    let style: CSSProperties = {};
    if (effect === 'fade') {
      style.opacity = index === current ? '1' : '0';
    }
    return (
      <div className={cssStyle.carousel_slide} style={style}>
        {child}
      </div>
    );
  };
  const renderSlides = () => {
    let wrapChildren = Children.map(children, wrapChild);
    if (loop) {
      let startElement = cloneElement(wrapChildren![childrenCount - 1]);
      let endElement = cloneElement(wrapChildren![0]);
      wrapChildren?.push(endElement);
      wrapChildren?.unshift(startElement);
    }
    return wrapChildren?.map((child, index) => {
      return cloneElement(child, {
        key: index,
        'data-index': index,
      });
    });
  };

  return (
    <div
      className={cssStyle.carousel}
      style={{ width, height: containerHeight }}
      ref={containerRef}
    >
      <div
        style={{
          ...slidesStyle,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          display: effect === 'slide' ? 'flex' : 'block',
          touchAction: direction === 'horizontal' ? 'pan-x' : 'pan-y',
        }}
        className={classNames(cssStyle.carousel_slides, {
          [cssStyle.carousel__fade]: effect === 'fade',
        })}
        {...eventMaps}
        ref={slidesEleRef}
      >
        {renderSlides()}
      </div>
      {showDots && (
        <div
          style={dotStyle()}
          className={classNames(cssStyle.carousel_dots, {
            [cssStyle.carousel_dots_vertical]: !dotPositionIsHorizontal,
          })}
        >
          {Children.map(children, (child, index) => {
            let classes = classNames({
              [cssStyle.carousel_dots_active]: index === current && dotType === 'dot',
              [cssStyle.carousel_dots_line_active]: index === current && dotType === 'line',
              [cssStyle.carousel_dots_dot]: dotType === 'dot',
              [cssStyle.carousel_dots_line]: dotType === 'line',
            });

            return (
              <div
                className={classes}
                data-is-dot="1"
                style={{ margin: dotPositionIsHorizontal ? '0 4px' : '4px 0' }}
                {...dotEvent(index)}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default forwardRef(Carousel);
