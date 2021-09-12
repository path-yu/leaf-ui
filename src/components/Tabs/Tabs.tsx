/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import {
  Children,
  CSSProperties,
  FC,
  FunctionComponentElement,
  MouseEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import { TabPaneProps } from './TabPane';
interface TabsProps {
  // 初始化选中面板的 key，如果没有设置 activeKey
  defaultIndex?: number;
  // 切换面板的回调
  onChange?: (index: number) => void;
  // 可扩展的className
  className?: string;
  // Tabs的样式类型, 两种可选 默认为line
  type?: 'line' | 'card';
  // 是否开启动画
  animated?: boolean;
  //底部导航栏模式 只在animated 为true 时生效
  activeBarMode?: 'center' | 'fill';
  // 标签居中显示
  centered?: boolean;
}
interface IActiveBarStyle {
  width?: string;
  left?: string;
}
const Tabs: FC<TabsProps> = (props) => {
  const {
    defaultIndex,
    onChange,
    className,
    children,
    type,
    animated,
    activeBarMode,
    centered,
  } = props;
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [activeBarStyle, setActiveBarStyle] = useState<IActiveBarStyle>({
    left: '0px',
    width: '32px',
  });
  const tabsListRef = useRef<HTMLDivElement>(null);
  const tabsItemWidth = useRef<number>(0);
  const cacheChildren = useRef<Array<number>>([]);
  const navClass = classNames('simple-tabs-nav', {
    'nav-line': type === 'line',
    'nav-card': type === 'card',
  });
  const [tabStyle, setTabStyle] = useState({
    opacity: 0,
  });
  const centerStyle: CSSProperties = {
    justifyContent: centered ? 'center' : 'flex-start',
  };
  useEffect(() => {
    // 如果animated为true 则初始化设置底部导航栏样式 否者使用border-bottom作为底部导航栏
    if (animated && tabStyle.opacity === 0 && type === 'line') {
      const parentElement = tabsListRef.current!.children[
        defaultIndex as number
      ] as HTMLLIElement;
      tabsItemWidth.current = parentElement.offsetWidth;
      const spaEle = parentElement.children[0] as HTMLSpanElement;
      inItActiveBarStyle(parentElement, spaEle);
    } else {
    }
    setTabStyle({ opacity: 1 });
  }, [animated, tabStyle.opacity, defaultIndex]);

  // 初始化计算底部导航栏样式
  const inItActiveBarStyle = (
    parentElement: HTMLLIElement,
    target: HTMLSpanElement
  ) => {
    const index = defaultIndex as number;
    // 计算单个tabItem长度
    let barStyle: IActiveBarStyle = {};
    const parentElementOffSetWith = parentElement.offsetWidth;
    if (activeBarMode === 'fill') {
      barStyle.width = parentElementOffSetWith + 'px';
      barStyle.left = parentElementOffSetWith * index + 'px';
    } else {
      barStyle.left = target.offsetLeft + 'px';
      barStyle.width = target.offsetWidth + 'px';
    }
    setActiveBarStyle(barStyle);
  };

  // 切换tab底部导航栏样式
  const changeBarStyle = (currentTarget: HTMLElement, index: number) => {
    let left: number;
    if (activeBarMode === 'center') {
      left = (currentTarget.children[0] as HTMLElement).offsetLeft;
    } else {
      left = tabsItemWidth.current * index;
    }
    const style: IActiveBarStyle = {
      ...activeBarStyle,
      left: left + 'px',
    };
    setActiveBarStyle(style);
  };
  const handleClick = (
    e: MouseEvent,
    index: number,
    disabled: boolean | undefined
  ) => {
    if (!disabled) {
      setActiveIndex(index);
      if (type === 'line' && animated) {
        changeBarStyle(e.currentTarget as HTMLElement, index);
      }
      onChange && onChange(index);
    }
  };
  const isActive = (index: number) => index === activeIndex;
  const isRenderBar = () => type === 'line' && animated;
  const renderNavLinks = () => {
   return Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<TabPaneProps>;
      const { label, disabled } = childElement.props;
      const classes = classNames('simple-tabs-nav-item', {
        'is-active': activeIndex === index,
        disabled: disabled,
        'is-active-bottom-bar': activeIndex === index && !animated,
      });
      return (
        <li
          className={classes}
          key={`nav-item-${index}`}
          onClick={(e: MouseEvent) => {
            handleClick(e, index, disabled);
          }}
        >
          <span> {label}</span>
        </li>
      );
    });
    // return <div>
    //   {navLinkChildren}
    //   {isRenderBar() && renderAnimateBar()}
    // </div>;
  };

  const renderContent = () => {
    return Children.map(children, (child, index) => {
      const displayStyle = isActive(index) ? 'block' : 'none';
      if (isActive(index)) {
        cacheChildren.current.push(index);
      }
      // 判断是否初始化渲染child
      const isRenderChild = cacheChildren.current.includes(index);
      return (
        <div style={{ display: displayStyle }}>{isRenderChild && child}</div>
      );
    });
  };
  const renderAnimateBar = () => {
    return (
      <div
        className="simple-tabs-ink-bar simple-ink-bar-animated"
        style={activeBarStyle}
      ></div>
    );
  };

  return (
    <div
      style={tabStyle}
      className={`simple-tabs ${className ? classNames : ''}`}
    >
      <ul className={navClass} style={centerStyle}>
        <div ref={tabsListRef} className="tabsList">
          {renderNavLinks()}
          {isRenderBar() && renderAnimateBar()}
        </div>
      </ul>
      <div className="simple-tabs-content">
        <div className="d-flex" style={centerStyle}>
          {' '}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
Tabs.defaultProps = {
  defaultIndex: 0,
  type: 'line',
  activeBarMode: 'center',
  animated: false,
  centered: false,
};
export default Tabs;
