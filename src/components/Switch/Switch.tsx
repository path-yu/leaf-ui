import React, { FC, ReactNode, MouseEvent, useState } from 'react';
import cssStyle from './Switch.module.scss';
import classNames from 'classnames';
import { useSkipFistEffect } from '../../hook';
interface SwitchProps {
  /**
   * @description 当前是否选中
   */
  checked?: boolean;
  /**
   * @description 初始是否选中
   */
  defaultChecked?: boolean;
  /**
   * @description 选中的内容
   */
  checkedChildren?: ReactNode;
  /**
   * @description Switch容器元素扩展类名
   */
  className?: string;
  /**
   * @description 是否禁用
   */
  disabled?: boolean;
  /**
   * @description 加载中的开关
   */
  loading?: boolean;
  /**
   * @description 开关大小 可选值：default small
   */
  size: 'small' | 'medium' | 'large';
  /**
   * @description 未选中时的内容
   */
  unCheckedChildren?: ReactNode;
  /**
   * @description 变化时的回调函数
   */
  onChange?: (checked: boolean) => void;
  /**
   * @description 点击时回调函数
   */
  onClick?: (checked: boolean, event: MouseEvent) => void;
}

const sizeMaps = {
  medium: '18px',
  small: '14px',
  large: '22px',
};
const Switch: FC<SwitchProps> = (props) => {
  const {
    checked,
    defaultChecked,
    disabled,
    loading,
    unCheckedChildren,
    checkedChildren,
    className,
    onChange,
    onClick,
    size,
  } = props;
  const [checkedValue, setCheckedValue] = useState(defaultChecked);
  // @ts-ignore
  let classes = classNames(className, cssStyle.switch, cssStyle['switch_' + size]);
  let isUndefined = typeof checked === 'undefined';
  let validate = isUndefined ? checkedValue : checked;
  let tabIndexPro = disabled ? {} : { tabIndex: 0 };
  useSkipFistEffect(() => {
    if (!isUndefined) {
      onChange?.(checked!);
    }
  }, [checked]);
  const handleRailClick = (event: MouseEvent) => {
    if (typeof checked === 'undefined') {
      setCheckedValue(!checkedValue);
      onChange?.(!checkedValue);
      onClick?.(!checkedValue, event);
    } else {
      onChange?.(!checked);
      onClick?.(checked, event);
    }
  };
  return (
    <div
      className={classes}
      {...tabIndexPro}
      style={{
        cursor: disabled ? 'not-allowed' : loading ? 'wait' : 'pointer',
        opacity: disabled ? '0.4' : '1',
      }}
    >
      <div
        className={cssStyle.switch_rail}
        style={{
          background: validate ? '#1890ff' : '#DBDBDB',
          pointerEvents: disabled ? 'none' : 'inherit',
        }}
        onClick={handleRailClick}
      >
        <div
          className={classNames(cssStyle.switch_button, {
            [cssStyle.switch_button_active]: validate,
          })}
        >
          {loading && !disabled && (
            <span className={cssStyle.switch_loading_icon}>
              <svg
                viewBox="0 0 1024 1024"
                focusable="false"
                data-icon="loading"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
              </svg>
            </span>
          )}
        </div>
        {(checkedChildren || unCheckedChildren) && (
          <div className={cssStyle.switch_inner}>
            {validate ? checkedChildren : unCheckedChildren}
          </div>
        )}
      </div>
    </div>
  );
};
Switch.defaultProps = {
  disabled: false,
  loading: false,
  onChange: () => {},
  onClick: () => {},
  size: 'medium',
  defaultChecked: false,
};
export default Switch;
