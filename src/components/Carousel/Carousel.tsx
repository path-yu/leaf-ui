import React, {
  PropsWithChildren,
  FC,
  Children,
  useState,
  useEffect,
  useRef,
  CSSProperties,
  ReactNode,
  cloneElement,
} from 'react';
import cssStyle from './Carousel.module.scss';
import classNames from 'classnames';
import { useElementHover } from '../../hook/useElementHover';
export interface CarouselProps {
  /**
   * @description 是否自动播放
   */
  autoplay?: boolean;
  /**
   * @description 面板指示点位置，可选 top bottom left right
   */
  dotPosition?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * @description 轮播图显示的方向
   */
  direction: 'vertical' | 'horizontal';
  /**
   * @description 指示点样式
   */
  dotType?: 'dot' | 'line';
  /**
   * @description 当前显示页
   */
  currentIndex?: number;
  /**
   * @description 默认显示页
   */
  defaultIndex?: number;
  /**
   * @description 自动播放的间隔（ms）
   */
  interval?: number;
  /**
   * @description 是否通过鼠标拖拽切换轮播图
   */
  draggable?: boolean;
  /**
   * @description 是否展示指示点
   */
  showDots?: boolean;
  /**
   * @description 轮播图切换时的过渡效果
   */
  effect?: 'slide' | 'fade' | 'card' | 'custom';
  /**
   * @description 指示点触发切换的方式
   */
  trigger?: 'click' | 'hover';
  /**
   * @description 当前页更新的回调
   */
  onChange?: (currentIndex: number, prevIndex: number) => void;
  /**
   * @description 是否循环播放
   */
  loop?: boolean;
  /**
   * @description 轮播图宽度
   */
  width?: string;
}
const Carousel: FC<PropsWithChildren & CarouselProps> = (props) => {
  const {
    children,
    currentIndex,
    defaultIndex,
    autoplay,
    dotPosition,
    direction,
    dotType,
    interval,
    loop,
    trigger,
    showDots,
    effect,
    draggable,
    onChange,
    width,
  } = props;
  let _defaultIndex = defaultIndex!;
  let childrenCount = Children.count(children);
  const duration = 300;
  const wrapChild = (child: ReactNode, index?: number) => (
    <div className={cssStyle.carousel_slide}>{child}</div>
  );
  const [current, setCurrent] = useState<number>(_defaultIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesEleRef = useRef<HTMLDivElement>(null);
  const containerSize = useRef({ width: 0, height: 0 });
  const [containerHeight, setContainerHeight] = useState('0');
  const prevIndex = useRef<null | number>(_defaultIndex);
  const isEnd = current === childrenCount - 1;
  let autoPlayMode = useRef<'reverse' | 'order'>(isEnd ? 'reverse' : 'order');
  const { isHoverRef } = useElementHover(containerRef);
  const [slidesStyle, setSlidesStyle] = useState<CSSProperties>({});
  const dotPositionIsHorizontal = dotPosition === 'top' || dotPosition === 'bottom';
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
    setContainerHeight(realHeight + 'px');
    toggleSlideTransitionDuration(false);
    updateSlideStyle(loop ? _defaultIndex + 1 : _defaultIndex);
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

  const handleDotTriggerEvent = (index: number) => {
    toggleSlideTransitionDuration(true);
    prevIndex.current = current!;
    setCurrent(index);
    updateSlideStyle(index + 1);
    onChange?.(index, current);
  };
  const dotEvent = (index: number) => {
    return trigger === 'click'
      ? {
          onClick: () => handleDotTriggerEvent(index),
        }
      : {
          onMouseEnter: () => handleDotTriggerEvent(index),
        };
  };
  const updateSlideStyle = (index: number) => {
    let style: CSSProperties = {};
    if (direction === 'horizontal') {
      style = { transform: `translateX(-${index * containerSize.current.width}px)` };
    } else {
      style = { transform: `translateY(-${index * 160}px)` };
    }
    setSlidesStyle(style);
  };
  const toggleSlideTransitionDuration = (enable = true) => {
    let slideEle = slidesEleRef.current as HTMLDivElement;
    slideEle.style.transitionDuration = enable ? `${duration}ms` : '';
  };
  const startAutoPlay = () => {
    let slideEle = slidesEleRef.current as HTMLDivElement;
    slideEle.style.transitionDuration = `${duration}ms`;
    if (isHoverRef.current) return;
    if (loop) {
      setCurrent((prev) => {
        prevIndex.current = prev;
        let resultIndex = prev === childrenCount - 1 ? 0 : prev + 1;
        if (prevIndex.current === childrenCount - 1) {
          updateSlideStyle(childrenCount + 1);
          setTimeout(() => {
            toggleSlideTransitionDuration(false);
            updateSlideStyle(1);
          }, duration + 50);
        } else {
          updateSlideStyle(resultIndex + 1);
        }
        onChange?.(resultIndex, prev);
        return resultIndex;
      });
    } else {
      setCurrent((prev) => {
        if (prev === 0) {
          autoPlayMode.current = 'order';
        }
        if (prev === childrenCount - 1) {
          autoPlayMode.current = 'reverse';
        }
        prevIndex.current = prev;
        let resultIndex = autoPlayMode.current === 'order' ? prev! + 1 : prev! - 1;
        updateSlideStyle(resultIndex);
        onChange?.(resultIndex, prev);
        return resultIndex;
      });
    }
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
        style={{ ...slidesStyle, flexDirection: direction === 'horizontal' ? 'row' : 'column' }}
        className={cssStyle.carousel_slides}
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
                style={{
                  margin: dotPositionIsHorizontal ? '0 4px' : '4px 0',
                }}
                {...dotEvent(index)}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
};
Carousel.defaultProps = {
  autoplay: false,
  defaultIndex: 0,
  dotPosition: 'bottom',
  direction: 'horizontal',
  dotType: 'dot',
  interval: 2000,
  draggable: false,
  loop: true,
  trigger: 'click',
  showDots: true,
  effect: 'slide',
  width: '100%',
};
export default Carousel;
