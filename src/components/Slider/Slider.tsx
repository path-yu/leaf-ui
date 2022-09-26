import React, {
  FC,
  useMemo,
  TouchEvent as ReactTouchEvent,
  MouseEvent as ReactMouseEvent,
  useRef,
  useEffect,
} from 'react';
import './slider.scss';
import classNames from 'classnames';
import { isMobile } from '../../utils/core/isMobile';
import { getEventClientPosition } from '../../utils/core/getEventClientPosition';
export interface SliderProps {
  /**
   * @description 设置初始取值。当 range 为 false 时，使用 number，否则用 [number, number]
   * @default 0 | [0,0]
   */
  defaultValue?: sliderValueType;
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
  value?: sliderValueType;
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
  onChange?: (value: sliderValueType) => void;
}
const _isMobile = isMobile();
type sliderValueType = number | [number, number];
const defaultSize = { width: 0, height: 0 };
type NativeAndReactTouchOrMouseEvent = ReactTouchEvent | ReactMouseEvent | TouchEvent | MouseEvent;
type PickDOMRectWidthAndHeight = Pick<DOMRect, 'width' | 'height'>;
const Slider: FC<SliderProps> = (props) => {
  const { vertical, max = 100, min = 0, onChange, defaultValue, range } = props;
  const percentage = useRef(defaultValue);
  const movePosition = useRef({ x: 0, y: 0 });
  const moveDiff = useRef({ x: 0, y: 0 });
  const isClick = useRef(false);
  const sliderRect = useRef<PickDOMRectWidthAndHeight>(defaultSize);
  const sliderRef = useRef<HTMLDivElement>(null);
  const clickHandleIndex = useRef<number | null>(null); // 记录当前从那个小圆点开始点击
  const sliderTrackRect = useRef<PickDOMRectWidthAndHeight>(defaultSize);
  const rangeSliderHandlePercentageSize = useRef<
    [PickDOMRectWidthAndHeight, PickDOMRectWidthAndHeight]
  >([defaultSize, defaultSize]);
  // 手指或者鼠标在圆点下按下
  const handleTouchStartOrMouseDown = (event: NativeAndReactTouchOrMouseEvent) => {
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
    if (typeof percentage.current === 'number') {
      let result = calcPercentage(
        vertical
          ? sliderTrackRect.current!.height + -moveDiff.current.y
          : sliderTrackRect.current!.width + moveDiff.current.x,
      );
      setPercentage(result);
    } else {
      const [onePercentage, twoPercentage] = percentage.current!;
      if (clickHandleIndex.current === 1) {
        let offset = vertical
          ? rangeSliderHandlePercentageSize.current[0].height + -moveDiff.current.y
          : rangeSliderHandlePercentageSize.current[0].width + moveDiff.current.x;
        setPercentage([calcPercentage(offset), twoPercentage]);
      } else {
        let offset = vertical
          ? rangeSliderHandlePercentageSize.current[1].height + -moveDiff.current.y
          : rangeSliderHandlePercentageSize.current[1].width + moveDiff.current.x;
        setPercentage([onePercentage, calcPercentage(offset)]);
      }
    }
    movePosition.current = { x, y };
  };
  // 手指抬起或者鼠标抬起
  const handleTouchEndOrMouseUp = () => {
    if (!isClick.current) return;
    isClick.current = false;
  };
  // 点击slider
  const handleSliderClick = (event: ReactMouseEvent) => {
    let target = event.target as HTMLDivElement;
    if (isClick.current || target.classList.contains('slider-handle')) return;
    let { offsetY, offsetX } = event.nativeEvent;
    if (typeof percentage.current === 'number') {
      setPercentage(calcPercentage(vertical ? sliderRect.current.height - offsetY : offsetX));
    } else {
      let clickTargetIsTrack = target.classList.contains('slider-track');
      const [onePercentage, twoPercentage] = percentage.current!;
      let currentClickOffset = vertical
        ? clickTargetIsTrack
          ? getPercentSize('height', twoPercentage) - offsetY
          : sliderRect.current.height - offsetY
        : clickTargetIsTrack
        ? getPercentSize('width', onePercentage) + offsetX
        : offsetX;
      let currentClickPercentage = calcPercentage(currentClickOffset);
      if (currentClickPercentage < onePercentage) {
        setPercentage([currentClickPercentage, twoPercentage]);
      } else if (currentClickPercentage > twoPercentage) {
        setPercentage([onePercentage, currentClickPercentage]);
      } else {
        let oneDiffPercentage = currentClickPercentage - onePercentage;
        let twoDiffPercentage = Math.abs(currentClickPercentage - twoPercentage);
        if (twoDiffPercentage > oneDiffPercentage) {
          setPercentage([currentClickPercentage, twoPercentage]);
        } else {
          setPercentage([onePercentage, currentClickPercentage]);
        }
      }
    }
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
    return result;
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
      console.log(rangeSliderHandlePercentageSize);
    }
  };
  const changeSliderStyle = () => {
    let target = sliderRef.current! as HTMLDivElement;
    const sliderTrackEle = target.childNodes[1] as HTMLDivElement;
    const sliderHandleOneEle = target.childNodes[2] as HTMLDivElement;
    const sliderHandleTwoEle = target.childNodes[3] as HTMLDivElement;
    let percentageStr = `${percentage.current}%`;
    if (typeof percentage.current === 'number') {
      if (vertical) {
        sliderTrackEle.style.height = percentageStr;
        sliderHandleOneEle.style.bottom = percentageStr;
      } else {
        sliderTrackEle.style.width = percentageStr;
        sliderHandleOneEle.style.left = percentageStr;
      }
    } else {
      const [onePercentage, twoPercentage] = percentage.current!;
      let diffPercentage = Math.abs(twoPercentage - onePercentage);
      if (vertical) {
        sliderHandleOneEle.style.bottom = percentageToStr(onePercentage);
        sliderHandleTwoEle.style.bottom = percentageToStr(twoPercentage);
        sliderTrackEle.style.cssText = `height:${percentageToStr(
          diffPercentage,
        )};bottom:${percentageToStr(Math.min(onePercentage, twoPercentage))}`;
      } else {
        sliderHandleOneEle.style.left = percentageToStr(onePercentage);
        sliderHandleTwoEle.style.left = percentageToStr(twoPercentage);
        sliderTrackEle.style.cssText = `width:${percentageToStr(
          diffPercentage,
        )};left:${percentageToStr(Math.min(onePercentage, twoPercentage))}`;
      }
    }
  };
  const percentageToStr = (value: number) => {
    return `${value}%`;
  };
  const setPercentage = (value: sliderValueType) => {
    percentage.current = value;
    changeSliderStyle();
    onChange?.(percentage.current);
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
  useEffect(() => {
    if (!_isMobile) {
      window.addEventListener('mousemove', handleTouchOrMouseMove);
      window.addEventListener('mouseup', handleTouchEndOrMouseUp);
    }
    sliderRect.current = {
      width: sliderRef.current!.scrollWidth,
      height: sliderRef.current!.scrollHeight,
    };
    changeSliderStyle();
    return () => {
      if (!_isMobile) {
        window.removeEventListener('mousemove', handleTouchOrMouseMove);
        window.removeEventListener('mouseup', handleTouchEndOrMouseUp);
      }
    };
  }, []);
  return (
    <div
      className={classNames('slider', {
        'slider-horizontal': !vertical,
        'slider-vertical': vertical,
      })}
      ref={sliderRef}
      onClick={handleSliderClick}
    >
      <div className="slider-rail"></div>
      <div className="slider-track"></div>
      <div
        data-index={1}
        className="slider-handle slider-handle1"
        tabIndex={0}
        {...eventMaps}
      ></div>
      {range && (
        <div
          data-index={2}
          className="slider-handle slider-handle2"
          tabIndex={0}
          {...eventMaps}
        ></div>
      )}
    </div>
  );
};

export default Slider;
