import React, { AnchorHTMLAttributes, ButtonHTMLAttributes, FC } from 'react';
import classNames from 'classnames';
//  将原生的button和a元素的props熟悉和自定义props属性进行联合
type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>;
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>;
// 最终Button的props类型
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;
import './_style.scss';
import { BaseButtonProps } from './Button.api';
import { CollapseItem } from '../../index';
const Button: FC<ButtonProps> = (props) => {
  const { className, btnType, disabled, size, children, share, href, ...resetProps } = props;
  const classes = classNames('btn', className, {
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    disabled: btnType === 'link' && disabled,
    [`btn-${share}`]: share,
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
  share: 'round',
};
export default Button;
