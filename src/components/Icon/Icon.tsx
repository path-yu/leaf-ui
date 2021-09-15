import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { FC } from 'react';

library.add(fas);
export type ThemeProps =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark';

export interface IconProps extends FontAwesomeIconProps {
  /** 支持框架主题 根据主题显示不同的颜色 */
  theme?: ThemeProps;
}

export const Icon: FC<IconProps> = (props) => {
  // icon-primary
  const { className, theme, ...restProps } = props;
  const classes = classNames('viking-icon', className, {
    [`icon-${theme}`]: theme,
  });
  return <FontAwesomeIcon className={classes} {...restProps} />;
};

export default Icon;
