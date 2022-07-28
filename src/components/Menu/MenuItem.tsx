import classNames from 'classnames';
import React, { CSSProperties, FC, ReactNode, useContext } from 'react';
import { MenuContext } from './menu';

export interface MenuItemProps {
  index?: string;
  // 选项是否被禁用
  disabled?: boolean;
  // 选项扩展的className
  className?: string;
  // 选项的自定义style
  style?: CSSProperties;
  children?: ReactNode;
}

export const MenuItem: FC<MenuItemProps> = (props) => {
  const { index, disabled, className, style, children } = props;
  const context = useContext(MenuContext);
  const classes = classNames('menu-item', className, {
    'is-disabled': disabled,
    'is-active': context.index === index,
  });
  const handleClick = () => {
    if (context.onselect && !disabled && typeof index === 'string') {
      context.onselect(index);
    }
  };
  return (
    <li className={classes} style={style} onClick={handleClick}>
      {children}
    </li>
  );
};
MenuItem.displayName = 'MenuItem';
export default MenuItem;