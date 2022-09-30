import React, {
  FC,
  useMemo,
  TouchEvent as ReactTouchEvent,
  MouseEvent as ReactMouseEvent,
  useRef,
  useEffect,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from 'react';
import './slider.scss';
import classNames from 'classnames';
import { isMobile } from '../../utils/core/isMobile';
import { getEventClientPosition } from '../../utils/core/getEventClientPosition';
import Tooltip, { TooltipExpose } from '../Tooltip/Tooltip';
export interface SliderProps {
  /**
   * @description 设置初始取值。当 range 为 false 时，使用 number，否则用 [number, number]
   * @default 0 | [0,0]
   */
  defaultValue?: number | [number, number];
  /**
   * @description 禁用slider
   * @default true
   */
  disabled?: boolean;
  /**
   * @description 值为true时, Slider是否为垂直方向
   * @default false
   */
  vertical?: boolean;
  /**
   * @description 设置当前取值。当 range 为 false 时，使用 number，否则用 [number, number]
   */
  value?: number | [number, number];
  /**
   * @description 最大值
   *@default 100
   */
  max?: number;
  /**
   * @description 最小值
   * @default 0
   */
  min?: number;
  /**
   * @description 双滑块模式
   * @default false
   */
  range?: boolean;
  /**
   * @description Slider值发生改变时的回调，并传入当前值作为参数
   */
  onChange?: (value: number | [number, number]) => void;
  /**
   * @description 与 `onmouseup` 触发时机一致，把当前值作为参数传入
   */
  onAfterChange?: (value: number | [number, number]) => void;
  /**
   * @description 反向坐标轴
   * @default false
   */
  reverse?: boolean;
  /**
   * @description 是否显示文字提示
   * @default true
   */
  showTips?: boolean;
  /**
   * @description Slider 会把当前值传给 formatter，并在 Tooltip 中显示 formatter 的返回值，
   */
  formatter?: (value: string) => string;
}
const _isMobile = isMobile();
type sliderValueType = number | [number, number];
const defaultSize = { width: 0, height: 0 };
type NativeAndReactTouchOrMouseEvent = ReactTouchEvent | ReactMouseEvent | TouchEvent | MouseEvent;
type PickDOMRectWidthAndHeight = Pick<DOMRect, 'width' | 'height'>;
export interface SliderExpose {
  blur: () => void;
  focus: () => void;
}
const Slider: ForwardRefRenderFunction<SliderExpose, SliderProps> = (props, ref) => {
  const {
    vertical,
    max = 100,
    min = 0,
    onChange,
    defaultValue = 0,
    value,
    range = false,
    disabled = false,
    reverse = false,
    onAfterChange,
    formatter,
    showTips = true,
  } = props;
  const percentage = useRef(value ? value : defaultValue);
  const movePosition = useRef({ x: 0, y: 0 });
  const moveDiff = useRef({ x: 0, y: 0 });
  const isClick = useRef(false);
  const sliderRect = useRef<PickDOMRectWidthAndHeight>(defaultSize);
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderHandleOneEleRef = useRef<HTMLDivElement>(null);
  const sliderHandleTwoEleRef = useRef<HTMLDivElement>(null);
  const clickHandleIndex = useRef<number | null>(null); // 记录当前从那个小圆点开始点击
  const sliderTrackRect = useRef<PickDOMRectWidthAndHeight>(defaultSize);
  const oneTooltipRef = useRef<TooltipExpose>(null);
  const twoTooltipRef = useRef<TooltipExpose>(null);
  const rangeSliderHandlePercentageSize = useRef<
    [PickDOMRectWidthAndHeight, PickDOMRectWidthAndHeight]
  >([defaultSize, defaultSize]);

  // 手指或者鼠标在圆点下按下
  const handleTouchStartOrMouseDown = (event: NativeAndReactTouchOrMouseEvent) => {
    if (disabled) return;
    isClick.current = true;
    const { x, y } = getEventClientPosition(event);
    const currentTarget = event.currentTarget as HTMLDivElement;
    movePosition.current = { x, y };
    moveDiff.current = { x: 0, y: 0 };
    if (range) {
      setRangeHandleRect();
    } else {
      setTrackRect();
    }
    clickHandleIndex.current = +currentTarget.getAttribute('data-index')!;
  };
  // 手指移动或者鼠标移动
  const handleTouchOrMouseMove = (event: NativeAndReactTouchOrMouseEvent) => {
    if (!isClick.current) return;
    const { x, y } = getEventClientPosition(event);
    moveDiff.current.x += x - movePosition.current.x;
    moveDiff.current.y += y - movePosition.current.y;
    let { x: moveDiffX, y: moveDiffY } = moveDiff.current;
    let absoluteMove = vertical
      ? reverse
        ? moveDiffY
        : -moveDiffY
      : reverse
      ? -moveDiffX
      : moveDiffX;

    if (typeof percentage.current === 'number') {
      let result = calcPercentage(
        vertical
          ? sliderTrackRect.current!.height + absoluteMove
          : sliderTrackRect.current!.width + absoluteMove,
      );
      setPercentage(result);
    } else {
      const [onePercentage, twoPercentage] = percentage.current!;
      if (clickHandleIndex.current === 1) {
        let offset = vertical
          ? rangeSliderHandlePercentageSize.current[0].height + absoluteMove
          : rangeSliderHandlePercentageSize.current[0].width + absoluteMove;
        setPercentage([calcPercentage(offset), twoPercentage]);
      } else {
        let offset = vertical
          ? rangeSliderHandlePercentageSize.current[1].height + absoluteMove
          : rangeSliderHandlePercentageSize.current[1].width + absoluteMove;
        setPercentage([onePercentage, calcPercentage(offset)]);
      }
    }
    movePosition.current = { x, y };
  };
  // 手指抬起或者鼠标抬起
  const handleTouchEndOrMouseUp = () => {
    if (!isClick.current) return;
    isClick.current = false;
    onAfterChange?.(percentage.current!);
    if (clickHandleIndex.current === 1 && oneTooltipRef.current) {
      setTimeout(() => {
        oneTooltipRef.current!.hideTooltip();
        oneTooltipRef.current!.setMouseLeaveLock(false);
      }, 300);
    }
    if (clickHandleIndex.current === 2 && twoTooltipRef.current) {
      setTimeout(() => {
        twoTooltipRef.current!.hideTooltip();
        twoTooltipRef.current!.setMouseLeaveLock(false);
      }, 300);
    }
  };
  const getClickOffset = (event: ReactMouseEvent) => {
    let sliderDOMRect = sliderRef.current!.getBoundingClientRect();
    let offsetX = event.clientX - sliderDOMRect.x;
    let offsetY = (event.clientY = sliderDOMRect.y);
    return {
      offsetX,
      offsetY,
    };
  };
  // 点击slider
  const handleSliderClick = (event: ReactMouseEvent) => {
    let target = event.target as HTMLDivElement;
    if (isClick.current || target.classList.contains('slider-handle') || disabled) return;
    let { offsetY, offsetX } = getClickOffset(event);
    offsetX = reverse ? sliderRect.current.width - offsetX : offsetX;
    offsetY = reverse ? offsetY : sliderRect.current.height - offsetY;
    if (typeof percentage.current === 'number') {
      setPercentage(calcPercentage(vertical ? offsetY : offsetX), 1);
    } else {
      const [onePercentage, twoPercentage] = percentage.current!;
      let currentClickPercentage = calcPercentage(vertical ? offsetY : offsetX);
      if (currentClickPercentage < onePercentage) {
        setPercentage([currentClickPercentage, twoPercentage], 1);
      } else if (currentClickPercentage > twoPercentage) {
        setPercentage([onePercentage, currentClickPercentage], 2);
      } else {
        let oneDiffPercentage = currentClickPercentage - onePercentage;
        let twoDiffPercentage = Math.abs(currentClickPercentage - twoPercentage);
        if (twoDiffPercentage > oneDiffPercentage) {
          setPercentage([currentClickPercentage, twoPercentage], 1);
        } else {
          setPercentage([onePercentage, currentClickPercentage], 2);
        }
      }
    }
  };
  const getOnePercentageStr = () => {
    return typeof percentage.current === 'number'
      ? percentage.current.toString()
      : percentage.current[0].toString();
  };
  const getTwoPercentageStr = () => {
    return (percentage.current as number[])[1].toString();
  };
  const calcPercentage = (value: number) => {
    let result = Math.round(
      (value / (vertical ? sliderRect.current!.height : sliderRect.current!.width)) * 100,
    );
    if (result > max) {
      result = max;
    }
    if (result < min) {
      result = min;
    }
    return Math.abs(result);
  };
  const getPercentSize = (type: 'width' | 'height', percentage: number) => {
    if (type === 'width') {
      return (percentage * sliderRect.current.width) / 100;
    } else {
      return (percentage * sliderRect.current.height) / 100;
    }
  };
  const setTrackRect = () => {
    let percentageValue =
      typeof percentage.current === 'number'
        ? percentage.current
        : percentage.current![1] - percentage.current![0];
    if (vertical) {
      sliderTrackRect.current!.height = Math.round(
        sliderRect.current!.height! * (percentageValue / 100),
      );
    } else {
      sliderTrackRect.current!.width = Math.round(
        sliderRect.current!.width! * (percentageValue / 100),
      );
    }
  };
  const setRangeHandleRect = () => {
    if (typeof percentage.current !== 'number') {
      const [onePercentage, twoPercentage] = percentage.current!;
      if (vertical) {
        rangeSliderHandlePercentageSize.current = [
          { height: getPercentSize('height', onePercentage), width: 0 },
          { height: getPercentSize('height', twoPercentage), width: 0 },
        ];
      } else {
        rangeSliderHandlePercentageSize.current = [
          { width: getPercentSize('width', onePercentage), height: 0 },
          { width: getPercentSize('width', twoPercentage), height: 0 },
        ];
      }
    }
  };
  const setSliderTrackStyle = (ele: HTMLDivElement, percentageStr: string) => {
    ele.style.cssText = `${vertical ? 'height' : 'width'}:${percentageStr};${
      vertical ? (reverse ? 'top:0% ' : 'bottom:0%') : reverse ? 'right:0% ' : 'left:0%'
    }`;
  };
  const setSliderRangeTrackStyle = (
    sliderTrackEle: HTMLElement,
    onePercentage: number,
    twoPercentage: number,
  ) => {
    let diffPercentage = Math.abs(twoPercentage - onePercentage);
    sliderTrackEle.style.cssText = `${vertical ? 'height' : 'width'}:${percentageToStr(
      diffPercentage,
    )};${vertical ? (reverse ? 'top' : 'bottom') : reverse ? 'right' : 'left'}:${percentageToStr(
      Math.min(onePercentage, twoPercentage),
    )}`;
  };
  const setSliderHandleStyle = (ele: HTMLDivElement, percentageStr: string) => {
    ele.style.cssText = `${
      vertical ? (reverse ? 'top ' : 'bottom') : reverse ? 'right' : 'left'
    }:${percentageStr};translate:${
      vertical ? (reverse ? '0 -50%' : '0 50%') : reverse ? '50%' : '-50%'
    }`;
  };
  const changeSliderStyle = () => {
    let target = sliderRef.current! as HTMLDivElement;
    const sliderTrackEle = target.childNodes[1] as HTMLDivElement;
    const sliderHandleOneEle = sliderHandleOneEleRef.current as HTMLDivElement;
    const sliderHandleTwoEle = sliderHandleTwoEleRef.current as HTMLDivElement;
    if (typeof percentage.current === 'number') {
      let percentageStr = percentageToStr(percentage.current);
      setSliderTrackStyle(sliderTrackEle, percentageStr);
      setSliderHandleStyle(sliderHandleOneEle, percentageStr);
    } else {
      const [onePercentage, twoPercentage] = percentage.current!;
      if (vertical) {
        setSliderHandleStyle(sliderHandleOneEle, percentageToStr(onePercentage));
        setSliderHandleStyle(sliderHandleTwoEle, percentageToStr(twoPercentage));
        setSliderRangeTrackStyle(sliderTrackEle, onePercentage, twoPercentage);
      } else {
        setSliderHandleStyle(sliderHandleOneEle, percentageToStr(onePercentage));
        setSliderHandleStyle(sliderHandleTwoEle, percentageToStr(twoPercentage));
        setSliderRangeTrackStyle(sliderTrackEle, onePercentage, twoPercentage);
      }
    }
  };

  const percentageToStr = (value: number) => {
    return `${value}%`;
  };
  const getOnePercentageTitle = () =>
    formatter ? formatter(getOnePercentageStr()) : getOnePercentageStr();
  const getTwoPercentageTitle = () =>
    formatter ? formatter(getTwoPercentageStr()) : getTwoPercentageStr();
  const setPercentage = (sliderValue: sliderValueType, clickIndex?: number) => {
    if (!value) {
      percentage.current = sliderValue;
      changeSliderStyle();
    }
    if (!clickIndex) {
      clickIndex = clickHandleIndex.current!;
    }
    if (showTips) {
      if (clickIndex === 1 && oneTooltipRef.current) {
        oneTooltipRef.current.setTitle(getOnePercentageTitle());
        oneTooltipRef.current.setPosition(sliderHandleOneEleRef.current!);
        isClick.current && oneTooltipRef.current.setMouseLeaveLock(true);
      }
      if (clickIndex === 2 && twoTooltipRef.current) {
        twoTooltipRef.current.setTitle(getTwoPercentageTitle());
        twoTooltipRef.current.setPosition(sliderHandleTwoEleRef.current!);
        isClick.current && twoTooltipRef.current.setMouseLeaveLock(true);
      }
    }

    onChange?.(sliderValue);
  };
  const eventMaps = useMemo(() => {
    if (_isMobile) {
      return {
        onTouchStart: handleTouchStartOrMouseDown,
        onTouchMove: handleTouchOrMouseMove,
        onTouchEnd: handleTouchEndOrMouseUp,
      };
    } else {
      return {
        onMouseDown: handleTouchStartOrMouseDown,
      };
    }
  }, [percentage]);
  const setSliderRect = () => {
    sliderRect.current = {
      width: sliderRef.current!.scrollWidth,
      height: sliderRef.current!.scrollHeight,
    };
  };
  useEffect(() => {
    if (!_isMobile) {
      window.addEventListener('mousemove', handleTouchOrMouseMove);
      window.addEventListener('mouseup', handleTouchEndOrMouseUp);
    }
    setSliderRect();
    window.addEventListener('resize', setSliderRect);
    changeSliderStyle();
    return () => {
      if (!_isMobile) {
        window.removeEventListener('mousemove', handleTouchOrMouseMove);
        window.removeEventListener('mouseup', handleTouchEndOrMouseUp);
        window.removeEventListener('resize', setSliderRect);
      }
    };
  }, [reverse]);
  useEffect(() => {
    if (value) {
      percentage.current = value;
      changeSliderStyle();
    }
  }, [value]);
  useImperativeHandle(ref, () => ({
    focus() {
      sliderHandleOneEleRef.current!.focus();
      if (sliderHandleTwoEleRef.current) {
        sliderHandleTwoEleRef.current.focus();
      }
    },
    blur() {
      sliderHandleOneEleRef.current!.blur();
      if (sliderHandleTwoEleRef.current) {
        sliderHandleTwoEleRef.current.blur();
      }
    },
  }));
  const tabIndexObj = disabled ? {} : { tabIndex: 0 };
  let sliderOneHandle = (
    <div
      data-index={1}
      className="slider-handle slider-handle1"
      {...eventMaps}
      {...tabIndexObj}
      ref={sliderHandleOneEleRef}
    ></div>
  );
  let sliderTwoHandle = (
    <div
      data-index={2}
      className="slider-handle slider-handle2"
      {...tabIndexObj}
      {...eventMaps}
      ref={sliderHandleTwoEleRef}
    ></div>
  );
  if (showTips) {
    sliderOneHandle = (
      <Tooltip
        ref={oneTooltipRef}
        title={getOnePercentageTitle()}
        position={vertical ? 'right' : 'top'}
      >
        {sliderOneHandle}
      </Tooltip>
    );
    if (typeof percentage.current !== 'number') {
      sliderTwoHandle = (
        <Tooltip
          ref={twoTooltipRef}
          title={getTwoPercentageTitle()}
          position={vertical ? 'right' : 'top'}
        >
          {sliderTwoHandle}
        </Tooltip>
      );
    }
  }
  return (
    <div
      className={classNames('slider', {
        'slider-horizontal': !vertical,
        'slider-vertical': vertical,
        'slider-disabled': disabled,
      })}
      ref={sliderRef}
      onClick={handleSliderClick}
    >
      <div className="slider-rail"></div>
      <div className="slider-track"></div>
      {sliderOneHandle}
      {range && sliderTwoHandle}
    </div>
  );
};

export default forwardRef(Slider);
