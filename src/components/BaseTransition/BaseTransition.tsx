import React, { CSSProperties, FC, PropsWithChildren, RefObject, useMemo, useRef } from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';
import { isObject } from 'lodash';
import { BaseTransitionProps } from './ReactTransitionPropsType';
import { CommonTransitionProps, easingType, timeoutType } from './Api/CommonTransitionProps';

type transitionStatusStyle = {
  [key in TransitionStatus]?: CSSProperties;
};
type newBaseTransitionProps = CommonTransitionProps & BaseTransitionProps<HTMLElement>;
const defaultDuration = 300;
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
  let { timeout, children, easing, appear = true } = props;
  const wrapTargetRef = useRef<HTMLDivElement>(null);
  if (!easing) {
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  }
  const transitionStyle = useMemo(() => {
    let defaultTransitionStyle: transitionStatusStyle = {
      entering: { opacity: 1 },
      entered: { opacity: 1 },
      exiting: { opacity: 0 },
      exited: { opacity: 0 },
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
    <BaseWrapTransition
      refTarget={wrapTargetRef}
      {...props}
      defaultStyle={defaultStyle}
      transitionStyle={transitionStyle}
    >
      {children}
    </BaseWrapTransition>
  );
};
export interface CollapseProps extends BaseTransitionProps<HTMLElement> {
  /**
   * @description 未扩展时的最小高度值。
   * @default 0
   */
  collapsedHeight?: number;
  /**
   * @description 开启水平方向折叠
   * @default false
   */
  orientation?: boolean;
}
const CollapseTransition: FC<newBaseTransitionProps & PropsWithChildren & CollapseProps> = (
  props,
) => {
  let { timeout, children, easing, appear = true, collapsedHeight = 0, orientation } = props;
  if (!easing) {
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  }
  const defaultSize = `${collapsedHeight}px`;
  const wrapTargetRef = useRef<HTMLDivElement>(null);
  const transitionStyle = useMemo(() => {
    let defaultTransitionStyle: transitionStatusStyle = {
      entering: {},
      exiting: {},
    };
    setTransitionStyle(defaultTransitionStyle, timeout, easing);
    return defaultTransitionStyle;
  }, [timeout, easing]);
  const defaultStyle = useMemo<CSSProperties>(
    () => ({
      height: defaultSize,
      transitionProperty: 'height',
      transitionDuration: isObject(timeout) ? `${timeout.appear}ms` : `${defaultDuration}ms`,
      transitionTimingFunction: isObject(easing) ? `${easing.enter}` : `${easing}`,
      overflow: 'hidden',
    }),
    [timeout, appear, easing],
  );
  return (
    <BaseWrapTransition
      refTarget={wrapTargetRef}
      {...props}
      defaultStyle={defaultStyle}
      transitionStyle={transitionStyle}
      onEnter={(isAppear) => {
        if (orientation) {
          wrapTargetRef.current!.style.width = wrapTargetRef.current!.scrollWidth + 'px';
        } else {
          wrapTargetRef.current!.style.height = wrapTargetRef.current!.scrollHeight + 'px';
        }
        props.onEnter?.(isAppear);
      }}
      onExit={() => {
        if (orientation) {
          wrapTargetRef.current!.style.width = defaultSize;
        } else {
          wrapTargetRef.current!.style.height = defaultSize;
        }
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
    onEnter,
    onEntering,
    onEntered,
    onExiting,
    onExited,
    onExit,
    unmountOnExit = false,
    mountOnEnter = false,
    addEndListener,
    nodeRef,
    defaultStyle,
    transitionStyle,
    refTarget,
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
      in={value}
      timeout={timeout}
      unmountOnExit={unmountOnExit}
      appear={appear}
      mountOnEnter={mountOnEnter}
      addEndListener={addEndListener}
      onEnter={onEnter}
      onEntering={onEntering}
      onEntered={onEntered}
      onExit={onExit}
      onExiting={onExiting}
      onExited={onExited}
      nodeRef={nodeRef}
    >
      {(state) => (
        <div
          style={{
            ...defaultStyle,
            ...transitionStyle[state],
          }}
          ref={refTarget}
        >
          {children}
        </div>
      )}
    </Transition>
  );
};
export { Fade, CollapseTransition };
