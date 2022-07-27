import React, {
  CSSProperties,
  FC,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  MouseEvent,
  Children,
} from 'react';
import { Icon } from '../../index';

import CSSMotion from 'rc-motion';
import collapseMotion from './utils/motinoUtils';

export interface CollapseItemProps {
  /**
   * @description 标题
   */
  title: string;
  /**
   * @description 名称
   */
  name: string;
  /**
   * @description 自定义图标
   */
  icon?: ReactNode;
  /**
   * @description 是否显示箭头
   */
  showArrow?: boolean;

  /**
   * @description 在折叠面板右侧自定义额外内容
   */
  headerExtra?: ReactNode;
  children?: ReactNode;
  [key: string]: any;
}
export interface privateRestProps {
  _arrowPlacement: 'left' | 'right';
  _accordion: boolean;
  _expendList: (string | number)[];
  _setExpendList: Dispatch<SetStateAction<(string | number)[]>>;
  _onUpdateExpandedNames?: (expandedNames: Array<string | number> | string | number | null) => void;
  _onItemHeaderClick?: (data: {
    name: string | number;
    expanded: boolean;
    event: MouseEvent;
  }) => void;
}
const CollapseItem: FC<CollapseItemProps> = (props) => {
  let { children, title, name, showArrow, icon, headerExtra, ...restProps } = props;
  let {
    _arrowPlacement,
    _accordion,
    _expendList,
    _setExpendList,
    _onUpdateExpandedNames,
    _onItemHeaderClick,
  } = restProps as privateRestProps;
  const [expanded, setExpanded] = useState(_expendList.includes(name));
  let isNesting = Children.toArray(children).some((child) => {
    // @ts-ignore
    return child?.type?.displayName === 'Collapse';
  });

  let titleStyle: CSSProperties = {};
  if (_arrowPlacement === 'left') {
    titleStyle.paddingLeft = '10px';
  } else {
    titleStyle.paddingRight = '10px';
  }
  const rotateExpandedStyle: CSSProperties = {
    transform: `rotate( ${expanded ? '90deg' : '0deg'} )`,
  };

  useEffect(() => {
    if (_accordion && expanded) {
      setExpanded(_expendList.includes(name));
    }
  }, [_expendList]);
  const handleItemClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (_accordion) {
      expanded ? _setExpendList([]) : _setExpendList([name]);
    } else {
      expanded
        ? _setExpendList(_expendList.filter((value) => value !== name))
        : _setExpendList([..._expendList, name]);
    }
    setExpanded(!expanded);
    _onItemHeaderClick &&
      _onItemHeaderClick({
        expanded: !expanded,
        name,
        event,
      });
    _onUpdateExpandedNames && _onUpdateExpandedNames(_expendList);
  };
  return (
    <div className="collapse-item" onClick={handleItemClick}>
      <div
        className="collapse-item-header"
        style={{ justifyContent: headerExtra ? 'space-between' : 'flex-start' }}
      >
        <div style={{ display: 'flex' }}>
          {showArrow && _arrowPlacement === 'left' && (
            <div className="icon-transition" style={rotateExpandedStyle}>
              {icon ? icon : <Icon icon="chevron-right" />}
            </div>
          )}
          <span style={titleStyle}>{title}</span>
          {showArrow && _arrowPlacement === 'right' && (
            <div className="icon-transition" style={rotateExpandedStyle}>
              {icon ? icon : <Icon icon="chevron-right" />}
            </div>
          )}
        </div>
        {headerExtra && headerExtra}
      </div>
      <CSSMotion visible={expanded} removeOnLeave={false} {...collapseMotion}>
        {({ className, style }) => (
          <div className={className} style={{ ...style, marginLeft: isNesting ? '32px' : '0' }}>
            {children}
          </div>
        )}
      </CSSMotion>
    </div>
  );
};
CollapseItem.displayName = 'CollapseItem';
CollapseItem.defaultProps = {
  showArrow: true,
};
export default CollapseItem;
