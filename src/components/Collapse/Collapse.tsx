import React, {
  Children,
  FC,
  FunctionComponentElement,
  ReactNode,
  useState,
  cloneElement,
  MouseEvent,
} from 'react';
import { CollapseItemProps } from './CollapseItem';
import './_style.scss';
export interface CollapseProps {
  /**
   * @description 是否允许展开一个面板
   */
  accordion?: boolean;
  /**
   * @description 箭头位置
   */
  arrowPlacement?: 'left' | 'right';
  /**
   * @description 非受控模式下默认展开的面板 name。accordion 模式时不为数组
   */
  defaultExpandedNames?: string | number | Array<string | number> | null;
  /**
   * @description 展开内容改变时触发的回调函数
   */
  onUpdateExpandedNames?: (expandedNames: Array<string | number> | string | number | null) => void;
  /**
   * @description 点击标题时触发的回调函数
   */
  onItemHeaderClick?: (data: {
    name: string | number;
    expanded: boolean;
    event: MouseEvent;
  }) => void;
  children?: ReactNode;
}
const Collapse: FC<CollapseProps> = (props) => {
  const {
    children,
    accordion,
    arrowPlacement,
    onItemHeaderClick,
    onUpdateExpandedNames,
    defaultExpandedNames,
  } = props;
  const calcDefaultExpend = () => {
    let defaultExpand: (string | number)[] = [];
    if (accordion && defaultExpandedNames && !Array.isArray(defaultExpandedNames)) {
      defaultExpand = [defaultExpandedNames];
    }
    if (!accordion && Array.isArray(defaultExpandedNames) && defaultExpandedNames) {
      defaultExpand = defaultExpandedNames;
    }
    return defaultExpand;
  };
  const [expendList, setExpendList] = useState<(string | number)[]>(calcDefaultExpend());
  const newChildren = Children.map(children, (child, index) => {
    const childElement = child as FunctionComponentElement<CollapseItemProps>;
    if (childElement.type.displayName !== 'CollapseItem') {
      console.error('Warning: Collapse has a child which is not a CollapseItem component');
    }
    return cloneElement(childElement, {
      _arrowPlacement: arrowPlacement,
      _accordion: accordion,
      _expendList: expendList,
      _setExpendList: setExpendList,
      _onUpdateExpandedNames: onUpdateExpandedNames,
      _onItemHeaderClick: onItemHeaderClick,
    });
  });
  return <div>{newChildren}</div>;
};

Collapse.defaultProps = {
  accordion: false,
  arrowPlacement: 'left',
};
Collapse.displayName = 'Collapse';
export default Collapse;
