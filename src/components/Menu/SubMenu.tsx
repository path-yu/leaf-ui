import classNames from 'classnames';
import { Children, FC, FunctionComponentElement, useContext } from 'react';
import { MenuContext } from './Menu';
import { MenuItemProps } from './MenuItem';


export interface SubMenu{
  index?: string,
  // x下拉菜单的名字
  title: string,
  className?:string
}

export const SubMenu: FC<SubMenu> = ({ index,title,children,className}) => {
  const context = useContext(MenuContext)
  const openedSubMenus = context.defaultOpenSubMenus as Array<string>
  const classes = classNames('menu-item','submenu-item',className, {
    'is-active':context.index === index
  })
  const renderChildren = () => {
    const childrenComponent = Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>;
      if (childElement.type.displayName === 'MenuItem') {
        return childElement
      } else {
        console.error(
          'Warning: SubMenu has a child which is not a MenuItem component'
        );
      }
    })
    return (
      <ul className="simple-submenu">
        {childrenComponent}
      </ul>
    )
  }
  return (
    <li key={index} className={classes}>
      <div className="submenu-title">{title}</div>
      {renderChildren()}
    </li>
  );
}
SubMenu.displayName = 'SubMenu';
export default SubMenu