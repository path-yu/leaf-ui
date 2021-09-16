import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import React, {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
} from 'react';
import Icon from '../Icon/icon';

type InputSize = 'lg' | 'sm';
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLElement>, 'size'> {
  /**是否禁用 Input*/
  disabled?: boolean;
  /**设置 input 大小，支持 lg 或者是 sm  */
  size?: InputSize;
  /**添加图标，在右侧悬浮添加一个图标，用于提示 */
  icon?: IconProp;
  /**添加前缀 用于配置一些固定组合 */
  prepend?: string | ReactElement;
  /**添加后缀 用于配置一些固定组合 */
  append?: string | ReactElement;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { disabled, size, icon, prepend, append, style, ...restProps } = props;
  const cnames = classNames('simple-input-wrapper', {
    [`input-size-${size}`]: size,
    'is-disabled': disabled,
    'input-group': prepend || append,
    'input-group-append': !!append,
    'input-group-prepend': !!prepend,
  });
  // 确保value是一个正常值
  const fixControlledValue = (value: any) => {
    if (typeof value === 'undefined' || value === null) {
      return '';
    }
    return value;
  };
  // 如果value 存在,则删除defaultValue,确保value和defaultValue的唯一性
  if ('value' in props) {
    delete restProps.defaultValue;
    restProps.value = fixControlledValue(props.value);
  }
  return (
    <div className={cnames} style={style}>
      {prepend && <div className="simple-input-group-prepend">{prepend}</div>}
      {icon && (
        <div className="icon-wrapper">
          <Icon icon={icon} title={`title-${icon}`} />
        </div>
      )}
      <input
        ref={ref}
        className="simple-input-inner"
        disabled={disabled}
        {...restProps}
      />
      {append && <div className="simple-input-group-append">{append}</div>}
    </div>
  );
});
Input.defaultProps = {
  disabled: false,
  size: 'lg',
};
export default Input;
