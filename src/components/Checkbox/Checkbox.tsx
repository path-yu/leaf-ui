import React, { ChangeEvent, FC, InputHTMLAttributes, PropsWithChildren, useState } from 'react';
import './CheckBox.scss';
import classNames from 'classnames';
interface CheckBoxProps {
  /**
   * @description 自动获取焦点
   */
  autoFocus?: boolean;
  /**
   * @description 指定当前是否选中
   * @default false
   */
  checked?: boolean;
  /**
   * @description 初始是否选中
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * @description 禁用状态
   * @default false
   */
  disabled?: boolean;
  /**
   * @description 设置 indeterminate 状态，只负责样式控制
   * @default false
   */
  indeterminate?: boolean;
  /**
   * @description 变化时的回调
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}
export type HTMLInputElementProps = Partial<InputHTMLAttributes<HTMLInputElement>>;
const Checkbox: FC<CheckBoxProps & PropsWithChildren> = (props) => {
  const {
    autoFocus = false,
    checked,
    defaultChecked = false,
    disabled = false,
    indeterminate = false,
    onChange,
    children,
    ...restProps
  } = props;
  const [myChecked, setMyChecked] = useState(defaultChecked);
  let checkedValue = checked !== undefined ? checked : myChecked;

  const checkboxProps: HTMLInputElementProps = {};
  if (checked !== undefined) {
    checkboxProps.checked = checked;
  } else {
    checkboxProps.defaultChecked = defaultChecked;
  }
  if (restProps.value) {
    checkboxProps.value = restProps.value;
  }
  if (restProps.name) {
    checkboxProps.name = restProps.name;
  }
  return (
    <label
      className={classNames('checkbox-wrapper', {
        ['checkbox-disabled']: disabled,
      })}
      {...restProps}
    >
      <span
        className={classNames('checkbox', {
          ['checkbox-checked']: checkedValue,
          ['checkbox-disabled']: disabled,
          ['checkbox-indeterminate']: indeterminate,
        })}
      >
        <input
          onChange={(ev) => {
            if (disabled) return;
            setMyChecked(!myChecked);
            let value = checked !== undefined ? !checked : !myChecked;
            if (checked === undefined) {
              setMyChecked(value);
            }
            onChange?.(ev);
          }}
          type="checkbox"
          className="checkbox-input"
          autoFocus={autoFocus}
          {...checkboxProps}
        />
        <span className="checkbox-inner"></span>
      </span>
      {children && <span>{children}</span>}
    </label>
  );
};

export default Checkbox;
