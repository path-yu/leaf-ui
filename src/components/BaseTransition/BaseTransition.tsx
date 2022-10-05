import React, { CSSProperties, FC, PropsWithChildren, RefObject, useMemo, useRef } from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';
import { isObject } from 'lodash';
import { BaseTransitionProps } from './ReactTransitionPropsType';
import { CommonTransitionProps, easingType, timeoutType } from './Api/CommonTransitionProps';

export type transitionStatusStyle = {
  [key in TransitionStatus]?: CSSProperties;
};
type newBaseTransitionProps = CommonTransitionProps & BaseTransitionProps<HTMLElement>;
const defaultDuration = 300;
const defaultEasing = 'cubic-bezier(0.4, 0, 0.2, 1)';
const setTransitionStyle = (
  style: transitionStatusStyle,
  timeout: timeoutType,
  easing: easingType,
) => {
  if (isObject(timeout)) {
    style.entering!.transitionDuration = `${timeout.enter}ms`;
    style.exiting!.transitionDuration = `${timeout.exit}ms`;
  }
  if (isObject(easing)) {
    style.exiting!.transitionTimingFunction = `${easing.exit}`;
    style.entering!.transitionTimingFunction = `${easing.enter}`;
  }
};
const getDefaultStyle = (timeout: timeoutType, easing: easingType) => {
  return {
    transitionDuration: isObject(timeout) ? `${timeout.appear}` : `${defaultDuration}ms`,
    transitionTimingFunction: isObject(easing) ? `${easing.enter}` : `${easing}`,
  };
};
const Fade: FC<PropsWithChildren & newBaseTransitionProps> = (props) => {
  let { timeout, children, easing = defaultEasing, appear = true } = props;

  const transitionStyle = useMemo(() => {
    let defaultTransitionStyle: transitionStatusStyle = {
      entering: { opacity: 1, visibility: 'visible' },
      entered: { opacity: 1, visibility: 'visible' },
      exiting: { opacity: 0, visibility: 'hidden' },
      exited: { opacity: 0, visibility: 'hidden' },
    };
    setTransitionStyle(defaultTransitionStyle, timeout, easing);
    return defaultTransitionStyle;
  }, [timeout, easing]);

  const defaultStyle = useMemo<CSSProperties>(
    () => ({
      opacity: 0,
      transitionProperty: 'opacity',
      ...getDefaultStyle(timeout, easing),
    }),
    [timeout, appear, easing],
  );
  return (
    <BaseWrapTransition {...props} defaultStyle={defaultStyle} transitionStyle={transitionStyle}>
      {children}
    </BaseWrapTransition>
  );
};
export interface CollapseProps extends BaseTransitionProps<HTMLElement> {
  /**
   * @description 未扩展时的最小值。
   * @default 0
   */
  collapsedSize?: number;
  /**
   * @description 开启水平方向折叠
   * @default false
   */
  horizontal?: boolean;
}
const CollapseTransition: FC<newBaseTransitionProps & PropsWithChildren & CollapseProps> = (
  props,
) => {
  let { timeout, children, easing, appear = true, collapsedSize = 0, horizontal } = props;
  if (!easing) {
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  }
  const defaultSizeStyle = `${collapsedSize}px`;
  const wrapTargetRef = useRef<HTMLDivElement>(null);
  let timeId: any;
  const transitionStyle = useMemo(() => {
    let defaultTransitionStyle: transitionStatusStyle = {
      entering: {},
      entered: {},
    };
    setTransitionStyle(defaultTransitionStyle, timeout, easing);
    return defaultTransitionStyle;
  }, [timeout, easing]);
  const defaultStyle = useMemo<CSSProperties>(() => {
    let style: CSSProperties = {
      transitionDuration: isObject(timeout) ? `${timeout.appear}ms` : `${defaultDuration}ms`,
      transitionTimingFunction: isObject(easing) ? `${easing.enter}` : `${easing}`,
      overflow: 'hidden',
    };
    if (horizontal) {
      style.width = defaultSizeStyle;
      style.transitionProperty = 'width';
    } else {
      style.height = defaultSizeStyle;
      style.transitionProperty = 'height';
    }
    return style;
  }, [timeout, appear, easing]);
  const handleEnterSetStyle = () => {
    let { scrollWidth, scrollHeight } = wrapTargetRef.current!;
    wrapTargetRef.current!.style[horizontal ? 'width' : 'height'] = `${
      horizontal ? scrollWidth : scrollHeight
    }px`;
  };
  return (
    <BaseWrapTransition
      refTarget={wrapTargetRef}
      {...props}
      defaultStyle={defaultStyle}
      transitionStyle={transitionStyle}
      onEnter={(isAppear) => {
        handleEnterSetStyle();
        props.onEnter?.(isAppear);
      }}
      onEntered={(isAppear) => {
        wrapTargetRef.current!.style[horizontal ? 'width' : 'height'] = 'auto';
        props.onEntered?.(isAppear);
      }}
      onExit={() => {
        handleEnterSetStyle();
        clearTimeout(timeId);
        timeId = setTimeout(() => {
          wrapTargetRef.current!.style[horizontal ? 'width' : 'height'] = defaultSizeStyle;
        });
        props.onExit?.();
      }}
    >
      {children}
    </BaseWrapTransition>
  );
};
interface BaseWrapTransitionProps {
  defaultStyle: CSSProperties;
  transitionStyle: transitionStatusStyle;
  refTarget?: RefObject<HTMLDivElement>;
}
const BaseWrapTransition: FC<
  PropsWithChildren & newBaseTransitionProps & BaseWrapTransitionProps
> = (props) => {
  let {
    timeout = 300,
    value = false,
    children,
    appear = true,
    unmountOnExit = false,
    mountOnEnter = false,
    wrap = true,
    style = {},
    defaultStyle,
    transitionStyle,
    refTarget,
    ...restProps
  } = props;
  if (!timeout) {
    timeout = defaultDuration;
  }
  if (isObject(timeout)) {
    !timeout.appear && (timeout.appear = defaultDuration);
    !timeout.enter && (timeout.enter = defaultDuration);
    !timeout.exit && (timeout.exit = defaultDuration);
  }
  return (
    <Transition
      {...restProps}
      in={value}
      timeout={timeout}
      unmountOnExit={unmountOnExit}
      appear={appear}
      mountOnEnter={mountOnEnter}
    >
      {(state) => (
        <div
          style={{
            ...defaultStyle,
            ...transitionStyle[state],
            ...style,
          }}
          ref={refTarget}
        >
          {children}
        </div>
      )}
    </Transition>
  );
};
const Zoom: FC<PropsWithChildren & newBaseTransitionProps> = (props) => {
  let { timeout, children, easing = 'cubic-bezier(0.4, 0, 0.2, 1)', appear = true } = props;
  const transitionStyle = useMemo(() => {
    let defaultTransitionStyle: transitionStatusStyle = {
      entering: { transform: 'scale(1)' },
      entered: { transform: 'scale(1)' },
      exiting: { transform: 'scale(0)' },
      exited: { transform: 'scale(0)' },
    };
    setTransitionStyle(defaultTransitionStyle, timeout, easing);
    return defaultTransitionStyle;
  }, [timeout, easing]);

  const defaultStyle = useMemo<CSSProperties>(
    () => ({
      transform: 'scale(0)',
      transitionProperty: 'transform',
      ...getDefaultStyle(timeout, easing),
    }),
    [timeout, appear, easing],
  );
  return (
    <BaseWrapTransition {...props} defaultStyle={defaultStyle} transitionStyle={transitionStyle}>
      {children}
    </BaseWrapTransition>
  );
};
export { Fade, CollapseTransition, Zoom, BaseWrapTransition };
