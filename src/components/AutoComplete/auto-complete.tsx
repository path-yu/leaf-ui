import classNames from 'classnames';
import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import useClickOutSize from '../../hook/useClickOutSize';
import useDebounce from '../../hook/useDebounce';
import Icon from '../Icon';
import Input, { InputProps } from '../Input/input';
import Transition from '../Transition';

interface DataSourceObject {
  value: string;
}
export enum keyBoardEnum {
  'ArrowUp' = 'ArrowUp',
  'ArrowDown' = 'ArrowDown',
  'Enter' = 'Enter',
  'Escape' = 'Escape',
}

export type DataSourceType<T = {}> = T & DataSourceObject;
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
  /**
   * 返回输入建议的方法，可以拿到当前的输入，然后返回同步的数组或者是异步的 Promise
   * type DataSourceType<T = {}> = T & DataSourceObject
   */
  fetchSuggestions: (
    str: string,
  ) => DataSourceType[] | Promise<DataSourceType[]>;
  /** 点击选中建议项时触发的回调*/
  onSelect: (item: DataSourceType) => void;
  /** 支持自定义渲染下拉选项 */
  renderOption?: (item: DataSourceType) => ReactElement;
}

const AutoComplete: FC<AutoCompleteProps> = (props) => {
  const { fetchSuggestions, onSelect, value, renderOption, ...restProps } =
    props;
  const [inputValue, setInputValue] = useState(value as string);
  const [suggestions, setSuggestions] = useState<DataSourceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const componentRef = useRef<HTMLDivElement>(null);

  // 当在组件外部进行点击时, 关闭下拉选项菜单
  useClickOutSize(componentRef, () => {
    setShowDropdown(false);
  });

  // 当suggestions 发生变化 是判断是否需要重新时候highlightIndex
  useEffect(() => {
    if (highlightIndex !== -1) {
      setHighlightIndex(-1);
    }
  }, [suggestions]);
  // 调用输入输入建议的方法, 向suggestions填充数据
  const fetchData = (value: string) => {
    setSuggestions([]);
    if (!value) return;
    const results = fetchSuggestions(value);
    if (results instanceof Promise) {
      setLoading(true);
      results.then((data) => {
        setLoading(false);
        setSuggestions(data);
        if (data.length > 0) {
          setShowDropdown(true);
        }
      });
    } else {
      setSuggestions(results);
      setShowDropdown(true);
      if (results.length > 0) {
        setShowDropdown(true);
      }
    }
  };
  const { fnRef } = useDebounce(fetchData, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
    (fnRef.current as Function)(value);
  };

  const handleSelect = (item: DataSourceType) => {
    setInputValue(item.value);
    setShowDropdown(false);
    onSelect && onSelect(item);
  };
  const highlight = (index: number) => {
    if (index < 0) index = 0;
    if (index >= suggestions.length) {
      index = suggestions.length - 1;
    }
    setHighlightIndex(index);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case keyBoardEnum.Enter:
        if (suggestions[highlightIndex]) {
          handleSelect(suggestions[highlightIndex]);
        }
        break;
      case keyBoardEnum.ArrowDown:
        highlight(highlightIndex + 1);
        break;
      case keyBoardEnum.ArrowUp:
        highlight(highlightIndex - 1);
        break;
      case keyBoardEnum.Escape:
        setShowDropdown(false);
      default:
        break;
    }
  };
  const renderTemplate = (item: DataSourceType) => {
    return renderOption ? renderOption(item) : item.value;
  };

  const renderDropdown = () => {
    return (
      <Transition
        in={showDropdown || loading}
        animation="zoom-in-top"
        timeout={300}
        onExited={() => {
          setSuggestions([]);
        }}
      >
        <ul className="simple-suggestion-list">
          {loading && (
            <div className="suggstions-loading-icon">
              <Icon icon="spinner" spin />
            </div>
          )}
          {suggestions.map((item, index) => {
            const cnams = classNames('suggestion-item', {
              'is-active': index === highlightIndex,
            });
            return (
              <li
                key={index}
                className={cnams}
                onClick={() => handleSelect(item)}
              >
                {renderTemplate(item)}
              </li>
            );
          })}
        </ul>
      </Transition>
    );
  };
  return (
    <div ref={componentRef} className="simple-auto-complete">
      <Input
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...restProps}
      />
      {renderDropdown()}
    </div>
  );
};
export default AutoComplete;
