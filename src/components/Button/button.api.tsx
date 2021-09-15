import { ReactNode } from 'react';

export type ButtonType = 'primary' | 'default' | 'danger' | 'link';
export type ButtonSize = 'lg' | 'sm';
export type ButtonShare = 'circle' | 'round';
export interface BaseButtonProps {
  /**可扩展的className */
  className?: string;
  /**
   * 是否禁用 Button
   * @default false
   */
  disabled?: boolean;
  /**
   * 设置Button的大小
   * @default lg
   */
  size?: ButtonSize;
  /**
   * 设置Button的类型
   * @default default
   */
  btnType?: ButtonType;
  children: ReactNode;
  /**当按钮为link类型时的href链接地址 */
  href?: string;
  /**button的形状
   * @default round
   */
  share?: ButtonShare;
}
export default (props: BaseButtonProps) => () => {};
