import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React, { ChangeEvent, ReactElement } from 'react';
export interface InputProps {
  /**是否禁用 Input
   * @default false
   */
  disabled?: boolean;
  /**设置 input 大小，支持 lg 或者是 sm
   * @default lg
   */
  size?: 'lg' | 'sm';
  /**添加图标，在右侧悬浮添加一个图标，用于提示 */
  icon?: IconProp;
  /**添加前缀 用于配置一些固定组合 */
  prepend?: string | ReactElement;
  /**添加后缀 用于配置一些固定组合 */
  append?: string | ReactElement;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export default (props: InputProps) => () => <></>;
