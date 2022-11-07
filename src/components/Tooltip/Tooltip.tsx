import React, {
  CSSProperties,
  FC,
  PropsWithChildren,
  ReactNode,
  MouseEvent,
  useRef,
  useState,
  isValidElement,
  forwardRef,
  cloneElement,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from 'react';
import './tooltips.scss';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
interface TooltipProps {
  /**
   * @description 提示文字
   * @default ""
   */
  title?: ReactNode | (() => ReactNode);
  /**
   * @description 位置
   * @default top
   */
  position?: 'top' | 'left' | 'right' | 'bottom';
  /**
   * @description 自定义样式
   */
  style?: CSSProperties;
  /**
   * @description 手动设置title
   */
}
const gap = 10;
export interface TooltipExpose {
  setPosition: (target: HTMLElement) => void;
  hideTooltip: () => void;
  setTitle: (value: string) => void;
  setMouseLeaveLock: (value: boolean) => void;
}
const Tooltip: ForwardRefRenderFunction<TooltipExpose, TooltipProps & PropsWithChildren> = (
  props,
  ref,
) => {
  const { position = 'top', title = '', style, children } = props;
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties>({});
  const containerDOMRect = useRef<DOMRect>(new DOMRect());
  const tooltipTextRef = useRef<HTMLElement>(null);
  const leaveLock = useRef(false);
  let timeId: any;
  const handleMouseEnter = (e: MouseEvent) => {
    clearTimeout(timeId);
    let target = e.currentTarget;
    timeId = setTimeout(() => {
      setPosition(target as HTMLElement);
    }, 100);
  };
  const getOffset = () => {
    let { x, y, width, height } = containerDOMRect.current;
    let { width: tooltipWidth, height: tooltipHeight } =
      tooltipTextRef.current!.getBoundingClientRect();
    let top, left;
    let horizontalTop = `${y - (tooltipHeight - height) / 2}px`;
    let verticalLeft = `${x - (tooltipWidth - width) / 2}px`;
    if (position === 'top') {
      top = `${y - tooltipHeight - gap}px`;
      left = verticalLeft;
    } else if (position === 'left') {
      top = horizontalTop;
      left = `${x - tooltipWidth - gap}px`;
    } else if (position === 'right') {
      top = horizontalTop;
      left = `${x + width + gap}px`;
    } else {
      top = `${y + height + gap / 2}px`;
      left = verticalLeft;
    }
    return {
      top,
      left,
    };
  };
  const handleMouseLeave = (e: MouseEvent) => {
    if (leaveLock.current) return;
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      setTooltipStyle((prev) => {
        return {
          ...prev,
          opacity: 0,
          visibility: 'hidden',
        };
      });
    }, 100);
  };
  const setContainerDOMRect = (el: HTMLElement | null) => {
    if (el) {
      containerDOMRect.current = el.getBoundingClientRect();
    }
  };
  const setPosition = (target: HTMLElement) => {
    setContainerDOMRect(target);
    setTooltipStyle({
      ...getOffset(),
      opacity: 1,
      visibility: 'visible',
    });
  };
  const hideTooltip = () => {
    setTooltipStyle((prev) => ({
      ...prev,
      opacity: 0,
      visibility: 'hidden',
    }));
  };
  const setTitle = (value: string) => {
    tooltipTextRef.current!.textContent = value;
  };
  const setMouseLeaveLock = (value: boolean) => {
    leaveLock.current = value;
  };
  useImperativeHandle(ref, () => ({ setPosition, hideTooltip, setTitle, setMouseLeaveLock }));
  const renderChildren = () => {
    return !isValidElement(children) ? (
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={setContainerDOMRect}
      >
        {children}
      </span>
    ) : (
      cloneElement(children as React.ReactElement<any>, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })
    );
  };

  return (
    <>
      {renderChildren()}
      {createPortal(
        <div
          className={classNames('tooltip', {
            ['tooltip-top']: position === 'top',
            ['tooltip-left']: position === 'left',
            ['tooltip-right']: position === 'right',
            ['tooltip-bottom']: position === 'bottom',
          })}
          style={style}
        >
          <span ref={tooltipTextRef} style={tooltipStyle} className="tooltips-text">
            {typeof title === 'function' ? title() : title}
          </span>
        </div>,
        document.body,
      )}
    </>
  );
};
export default forwardRef(Tooltip);
