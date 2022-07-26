import { ReactNode } from 'react';
export interface BaseButtonProps {
  /** 可扩展的className */
  className?: string;
  /**
   * @description 是否禁用 Button
   * @default false
   */
  disabled?: boolean;
  /**
   * 设置Button的大小
   * @default lg
   */
  size?: 'lg' | 'sm';
  /**
   * @description 设置Button的类型
   * @default default
   */
  btnType?: 'primary' | 'default' | 'danger' | 'link';
  /**当按钮为link类型时的href链接地址 */
  href?: string;
  /**
   * @description button的形状
   * @default round
   */
  share?: 'circle' | 'round';
  children: ReactNode;
}
export default (props: BaseButtonProps) => () => {};
