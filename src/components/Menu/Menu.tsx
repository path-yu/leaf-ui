import classNames from 'classnames';
import { createContext, CSSProperties, FC, useState } from 'react';


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
  return (
    <ul className={classes} style={style} data-testId="test-menu">
      <MenuContext.Provider value={passedContext}>
        {children}
      </MenuContext.Provider>
    </ul>
  );
}
Menu.defaultProps = {
  mode: 'horizontal',
  defaultIndex: '0',
}
export default Menu