import classNames from 'classnames';
import React, {
  createContext,
  FC,
  FunctionComponentElement,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import useClickOutSize from '../..//hook/useClickOutSize';
import Icon from '../Icon';
import Input from '../Input';
import Transition from '../Transition';
import { SelectOptionProps } from './option';

export interface SelectProps {
  /**指定默认选中的条目	 可以是是字符串或者字符串数组*/
  defaultValue?: string | string[];
  /** 选择框默认文字*/
  placeholder?: string;
  /** 是否禁用*/
  disabled?: boolean;
  /** 是否支持多选*/
  multiple?: boolean;
  /** select input 的 name 属性	 */
  name?: string;
  /**选中值发生变化时触发 */
  onChange?: (selectedValue: string, selectedValues: string[]) => void;
  /**下拉框出现/隐藏时触发 */
  onVisibleChange?: (visible: boolean) => void;
}
export interface ISelectContext {
  onSelect?: (value: string, isSelected?: boolean) => void;
  selectedValues: string[];
  multiple?: boolean;
}

export const SelectContext = createContext<ISelectContext>({
  selectedValues: [],
});

const Select: FC<SelectProps> = (props) => {
  const {
    defaultValue,
    placeholder,
    children,
    multiple,
    name,
    disabled,
    onChange,
    onVisibleChange,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLInputElement>(null);
  const containerWidth = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : [],
  );
  const [value, setValue] = useState(
    typeof defaultValue === 'string' ? defaultValue : '',
  );
  useClickOutSize(containerRef, () => {
    setMenuOpen(false);
    if (onVisibleChange && menuOpen) {
      onVisibleChange(false);
    }
  });
  useEffect(() => {
    // auto input focus
    if (inputRef.current) {
      inputRef.current.focus();
      if (multiple && selectedValues.length > 0) {
        inputRef.current.placeholder = '';
      } else {
        if (placeholder) inputRef.current.placeholder = placeholder;
      }
    }
  }, [selectedValues, multiple, placeholder]);
  useEffect(() => {
    if (containerRef.current) {
      containerWidth.current =
        containerRef.current.getBoundingClientRect().width;
    }
  });
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      setMenuOpen(!menuOpen);
      if (onVisibleChange) {
        onVisibleChange(!menuOpen);
      }
    }
  };
  const containerClass = classNames('simple-select', {
    'menu-is-open': menuOpen,
    'is-disabled': disabled,
    'is-multiple': multiple,
  });
  const handleOptionClick = (value: string, isSelected?: boolean) => {
    // update value
    if (!multiple) {
      setMenuOpen(false);
      setValue(value);
      onVisibleChange && onVisibleChange(false);
    } else {
      setValue('');
    }
    let updatedValues = [value];
    // click again to remove selected when is multiple mode
    if (multiple) {
      updatedValues = isSelected
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(updatedValues);
    }
    onChange && onChange(value, updatedValues);
  };
  const generateOptions = () => {
    return React.Children.map(children, (child, i) => {
      const childElement = child as FunctionComponentElement<SelectOptionProps>;
      if (childElement.type.displayName === 'Option') {
        return React.cloneElement(childElement, {
          index: `select-${i}`,
        });
      } else {
        console.error(
          'Warning: Select has a child which is not a Option component',
        );
      }
    });
  };
  const passedContext: ISelectContext = {
    onSelect: handleOptionClick,
    selectedValues: selectedValues,
    multiple: multiple,
  };
  return (
    <div className={containerClass} ref={containerRef}>
      <div className="simple-select-input" onClick={handleClick}>
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          readOnly
          icon="angle-down"
          disabled={disabled}
          name={name}
        />
      </div>
      <SelectContext.Provider value={passedContext}>
        <Transition in={menuOpen} animation="zoom-in-top" timeout={300}>
          <ul className="simple-select-dropdown">{generateOptions()}</ul>
        </Transition>
      </SelectContext.Provider>
      {multiple && (
        <div
          className="simple-selected-tags"
          style={{ maxWidth: containerWidth.current - 32 }}
        >
          {selectedValues.map((value, index) => {
            return (
              <span className="simple-tag" key={`tag-${index}`}>
                {value}
                <Icon
                  icon="times"
                  onClick={() => {
                    handleOptionClick(value, true);
                  }}
                />
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Select;
