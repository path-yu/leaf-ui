import classNames from 'classnames';
import React, {
  Children,
  cloneElement,
  createContext,
  CSSProperties,
  FC,
  FunctionComponentElement,
  useState,
} from 'react';
import { MenuItemProps } from './menu-item';

type SelectedCallback = (selectedIndex: string) => void;
type MenuMode = 'horizontal' | 'vertical';
interface IMenuContext {
  index?: string;
  onselect?: SelectedCallback;
  mode?: 'horizontal' | 'vertical';
  defaultOpenSubMenus?: string[];
}
export const MenuContext = createContext<IMenuContext>({ index: '0' });

export interface MenuProps {
  /**默认active的菜单栏索引值 */
  defaultIndex?: string;
  className?: string;
  /**菜单类型 横向或者纵向 */
  mode?: 'horizontal' | 'vertical';
  /** 自定义样式 */
  style?: CSSProperties;
  /**  点击菜单项触发的回调 */
  onSelect?: (selectedIndex: string) => void;
  /** 默认展开的下拉菜单 */
  defaultOpenSubMenus?: string[];
}

export const Menu: FC<MenuProps> = (props) => {
  const {
    className,
    mode,
    style,
    children,
    defaultIndex,
    onSelect,
    defaultOpenSubMenus,
  } = props;
  const [currentActive, setActive] = useState(defaultIndex);
  const classes = classNames('simple-menu', className, {
    'menu-vertical': mode === 'vertical',
    'menu-horizontal': mode === 'horizontal',
  });
  const handleClick = (index: string) => {
    setActive(index);
    onSelect && onSelect(index);
  };
  const passedContext: IMenuContext = {
    index: currentActive ? currentActive : '0',
    onselect: handleClick,
    mode,
    defaultOpenSubMenus,
  };
  const renderChildren = () => {
    return Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>;
      const { displayName } = childElement.type;
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        return cloneElement(childElement, {
          index: index.toString(),
        });
      } else {
        console.error(
          'Warning: Menu has a child which is not a MenuItem component',
        );
      }
    });
  };
  return (
    <ul className={classes} style={style} data-testid="test-menu">
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  );
};
Menu.defaultProps = {
  mode: 'horizontal',
  defaultIndex: '0',
  defaultOpenSubMenus: [],
};
export default Menu;
