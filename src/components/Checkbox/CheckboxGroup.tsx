import React, { ChangeEvent, FC, useRef } from 'react';
import Checkbox, { HTMLInputElementProps } from './Checkbox';

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
  onChange?: (e: ChangeEvent<HTMLInputElement>, checkedValue: string[]) => void;
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
      let { disabled = false } = item;
      checkboxValue = item.value;
      label = item.label;
      restProps.value = checkboxValue;
      restProps.disabled = disabled;
    }
    if (defaultValue.length !== 0) {
      restProps.defaultChecked = defaultValue.includes(checkboxValue);
    } else {
      restProps.defaultChecked = false;
    }
    if (value.length !== 0) {
      restProps.checked = value.includes(checkboxValue);
    } else {
      restProps.checked = false;
    }
    if (restProps.defaultChecked || restProps.checked) {
      checkedList.current.push(checkboxValue);
    }

    // defaultChecked 和 checked 只能二选一
    if (defaultValue.length > 0) {
      delete restProps.checked;
    } else if (value.length > 0) {
      delete restProps.defaultChecked;
    }
    if (disabled !== undefined) {
      if (typeof item !== 'string' && item.disabled === undefined) {
        restProps.disabled = disabled;
      }
    }
    name && (restProps.name = name);
    return {
      restProps,
      label,
    };
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let target = e.target;
    if (!checkedList.current.includes(target.value)) {
      checkedList.current.push(target.value);
    } else {
      checkedList.current = checkedList.current.filter((item) => item !== target.value);
    }
    onChange?.(e, checkedList.current);
  };
  const renderOptions = () => {
    checkedList.current = [];
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
