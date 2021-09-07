import classNames from 'classnames';
import {
  Children, cloneElement, FC,
  FunctionComponentElement,
  MouseEvent,
  useContext,
  useState
} from 'react';
import { MenuContext } from './Menu';
import { MenuItemProps } from './MenuItem';


export interface SubMenu{
  index?: string,
  // x下拉菜单的名字
  title: string,
  className?:string
}

export const SubMenu: FC<SubMenu> = ({ index,title,children,className}) => {
  const context = useContext(MenuContext);
  const openedSubMenus = context.defaultOpenSubMenus as Array<string>;
  const isOpen = (index && context.mode === 'vertical') ? openedSubMenus.includes(index) : false;
  const [menuOpen, setOpen] = useState(isOpen);
  const classes = classNames('menu-item','submenu-item',className, {
    'is-active':context.index === index
  })
  const subMenuClass = classNames('simple-submenu', {
    'menu-opened': menuOpen,
  });
  const handleCLick = (e: MouseEvent) => {
    e.preventDefault()
    setOpen(!menuOpen)
  }
  let timer: any;
  const handleMouse = (e: MouseEvent, toggle:boolean) => {
    clearTimeout(timer)
    e.preventDefault()
    timer = setTimeout(() => {
      setOpen(toggle)
    })
  }
  const clickEvents = context.mode === 'vertical' ? {
    onClick: handleCLick
  } : {};
  const hoverEvents =
    context.mode !== 'vertical'
      ? {
          onMouseEnter: (e: MouseEvent) => handleMouse(e, true),
          onMouseLeave: (e: MouseEvent) => handleMouse(e, false),
        }
      : {};
  
  const renderChildren = () => {
    const childrenComponent = Children.map(children, (child, i) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>;
      if (childElement.type.displayName === 'MenuItem') {
        return cloneElement(childElement, {
          index:`${index}-${i}`
        });
      } else {
        console.error(
          'Warning: SubMenu has a child which is not a MenuItem component'
        );
      }
    })
    return <ul className={subMenuClass}>{childrenComponent}</ul>;
  }
  return (
    <li key={index} className={classes} {...hoverEvents}>
      <div className="submenu-title" {...clickEvents}>
        {title}
      </div>
      {renderChildren()}
    </li>
  );
}
SubMenu.displayName = 'SubMenu';
export default SubMenu