import React, { ChangeEvent, FC, useRef, useState } from 'react';
import Checkbox, { HTMLInputElementProps } from './Checkbox';
import { Change } from '@react-spring/web';

interface CheckBoxGroupProps {
  /**
   * @description 默认选中的选项
   */
  defaultValue?: string[];
  /**
   * @description 整组失效
   * @default false
   */
  disabled?: boolean;
  /**
   * @description 	CheckboxGroup 下所有 input[type="checkbox"] 的 name 属性
   */
  name?: string;
  /**
   * @description 指定可选项
   * @default []
   */
  options?: (CheckBoxGroupOption | string)[];
  /**
   * @description 指定选中的选项
   */
  value?: string[];
  /**
   * @description 变化时的回调
   */
  onChange?: (checkedValue: string[]) => void;
}
export interface CheckBoxGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}
const CheckboxGroup: FC<CheckBoxGroupProps> = (props) => {
  const { defaultValue = [], disabled = false, name, options = [], value = [], onChange } = props;
  const checkedList = useRef<string[]>([]);

  const handleProps = (item: string | CheckBoxGroupOption) => {
    let restProps: HTMLInputElementProps = {};
    let checkboxValue: string, label: string;
    if (typeof item === 'string') {
      restProps.value = item;
      label = checkboxValue = item;
    } else {
      checkboxValue = item.value;
      label = item.label;
      restProps.value = checkboxValue;
    }
    if (defaultValue.includes(checkboxValue) && value.length === 0) {
      restProps.defaultChecked = true;
    }
    if (value.length > 0 && value.includes(checkboxValue)) {
      restProps.checked = true;
      delete restProps.defaultChecked;
    }
    if (restProps.defaultChecked || restProps.checked) {
      checkedList.current.push(checkboxValue);
    }
    disabled !== undefined && (restProps.disabled = disabled);
    name && (restProps.name = name);
    return {
      restProps,
      label,
    };
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let target = e.target;
    if (target.checked) {
      checkedList.current.push(target.value);
    } else {
      checkedList.current = checkedList.current.filter((item) => item !== target.value);
    }
    onChange?.(checkedList.current);
  };
  const renderOptions = () => {
    return options.map((item, index) => {
      const { restProps, label } = handleProps(item);
      return (
        // @ts-ignore
        <Checkbox className="checkbox-wrapper" key={index} {...restProps} onChange={handleChange}>
          {label}
        </Checkbox>
      );
    });
  };
  return <div className="checkbox-group">{renderOptions()}</div>;
};

export default CheckboxGroup;
