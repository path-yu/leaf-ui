import classNames from 'classnames';
import { Children, cloneElement, createContext, CSSProperties, FC, FunctionComponentElement, useState } from 'react';
import { MenuItemProps } from './MenuItem';


type MenuMode = 'horizontal' | 'vertical';
type SelectedCallback = (selectedIndex: string) => void

interface IMenuContext {
  index?: string;
  onselect?: SelectedCallback;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];
}
export const MenuContext = createContext<IMenuContext>({ index: '0' });


export interface MenuProps {
  // 默认active的菜单栏索引值
  defaultIndex?: string;
  className?: string;
  // 菜单类型 横向或者纵向
  mode?: MenuMode;
  style?: CSSProperties;
  // 点击菜单项触发的回调函数
  onSelect?: SelectedCallback;
}

export const Menu: FC<MenuProps> = (props) => {
    const {
      className,
      mode,
      style,
      children,
      defaultIndex,
      onSelect,
  } = props;
  const [currentActive, setActive] = useState(defaultIndex);
  const classes = classNames('simple-menu', className, {
    'menu-vertical': mode === 'vertical',
    'menu-horizontal': mode === 'horizontal',
  });
  const handleClick = (index:string) => {
    setActive(index)
    onSelect && onSelect(index)
  }
  const passedContext: IMenuContext = {
    index: currentActive ? currentActive : '0',
    onselect: handleClick,
    mode,
  };
  const renderChildren = () => {
    return Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>;
      const { displayName } = childElement.type
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        return cloneElement(childElement, {
          index: index.toString(),
        });
      } else {
        console.error(
          'Warning: Menu has a child which is not a MenuItem component'
        );
      }
    })
  }
  return (
    <ul className={classes} style={style} data-testid="test-menu">
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  );
}
Menu.defaultProps = {
  mode: 'horizontal',
  defaultIndex: '0',
}
export default Menu