import classNames from 'classnames';
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  FC,
  ReactNode
} from 'react';

export type ButtonType = 'primary' | 'default' | 'danger' | 'link';
export type ButtonSize = 'lg' | 'sm';
export type ButtonShare = 'circle' | 'round';
 interface BaseButtonProps {
   className?: string;
   /**是否禁用 Button */
   disabled?: boolean;
   /**设置 Button 的大小 */
   size?: ButtonSize;
   /**设置 Button 的类型 */
   btnType?: ButtonType;
   children: ReactNode;
   /**当按钮为link类型时的href链接地址 */
   href?: string;
   /**button的形状 */
   share?: ButtonShare;
 }
// * 将原生元素button和a标签的props属性和Button自定义的props属性类型进行联合
type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>;
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>;
// ! 最终Button组件的props类型文件
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;
/**
 * 页面中最常用的的按钮元素，适合于完成特定的交互，支持 HTML button 和 a 链接 的所有属性
 * ### 引用方法
 * ```js
 * import { Button } from 'simple-element'
 * ```
 */
const Button: FC<ButtonProps> = (props) => {
  const { className, btnType, disabled, size, children, href,share, ...resetProps } =
    props;
  // *btn btn-lg btn-primary
  const classes = classNames('btn', className, {
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    disabled: btnType === 'link' && disabled,
    [`btn-${share}`]:share
  });

  if (btnType === 'link' && href) {
    return (
      <a href={href} className={classes} {...resetProps}>
        {children}
      </a>
    );
  } else {
    return (
      <button className={classes} disabled={disabled} {...resetProps}>
        {children}
      </button>
    );
  }
};

Button.defaultProps = {
  disabled: false,
  btnType: 'default',
  share:'round'
};

export default Button;
