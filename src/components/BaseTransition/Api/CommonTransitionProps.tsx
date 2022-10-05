import { CSSProperties } from 'react';

export interface CommonTransitionProps {
  /**
   * @description 过渡持续时间，以毫秒为单位，可以指定一个数字类型，也可以指定不同状态下的过渡时间
   */
  timeout?: number | { appear?: number; enter?: number; exit?: number };
  /**
   * @description 触发进入或退出状态
   * @default false
   */
  value?: boolean;
  /**
   * @description 指定进入或离开过渡曲线
   * @default
   */
  easing?: { enter?: string; exit?: string } | string;
  /**
   * @description 如果value也为真, 那么首次挂载时将执行enter过渡行为
   * @default true
   */
  appear?: boolean;
  /**
   * @description 容器额外style
   */
  style?: CSSProperties;
}
export type timeoutType = number | { appear?: number; enter?: number; exit?: number } | undefined;
export type easingType = { enter?: string; exit?: string } | string | undefined;
export default (props: CommonTransitionProps) => {};
