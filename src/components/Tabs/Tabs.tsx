/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import * as React from 'react';
import {
  Children,
  CSSProperties,
  FC,
  FunctionComponentElement,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TabPaneProps } from './tab-pane';

export interface TabsProps {
  /** 初始化选中面板的 key，如果没有设置 activeKey */
  defaultIndex?: number;
  /**切换面板的回调 */
  onChange?: (index: number) => void;
  /** 可扩展的ClassName */
  className?: string;
  /** Tabs的样式类型, 两种可选 默认为line */
  type?: 'line' | 'card';
  /** 是否开启底部导航栏切换动画, 只有为type为line时生效 */
  animated?: boolean;
  /** 底部导航栏模式 只在animated 为true  type为line 时生效 */
  activeBarMode?: 'center' | 'fill';
  /** 标签居中显示*/
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
  const [activeBarStyle, setActiveBarStyle] = useState<IActiveBarStyle>();
  const tabsListRef = useRef<HTMLUListElement>(null);
  const tabsItemWidth = useRef<number>(0);
  const cacheChildrenIndex = useRef<Array<number>>([]);
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
      const target = parentElement.children[0] as HTMLHtmlElement;
      inItActiveBarStyle(parentElement, target);
    } else {
    }
    setTabStyle({ opacity: 1 });
  }, []);

  // 初始化计算底部导航栏样式
  const inItActiveBarStyle = (
    parentElement: HTMLLIElement,
    target: HTMLSpanElement,
  ) => {
    // 计算单个tabItem长度
    let barStyle: IActiveBarStyle = {};
    const parentElementOffSetWith = parentElement.offsetWidth;
    if (activeBarMode === 'fill') {
      barStyle.width = parentElementOffSetWith + 'px';
      barStyle.left = parentElement.offsetLeft + 'px';
    } else {
      barStyle.left = target.offsetLeft + 'px';
      barStyle.width = target.offsetWidth + 'px';
    }
    setActiveBarStyle(barStyle);
  };

  // 切换tab底部导航栏样式
  const changeBarStyle = (currentTarget: HTMLElement, index: number) => {
    let left: number;
    let width = tabsItemWidth.current;
    if (activeBarMode === 'center') {
      let ele = currentTarget.children[0] as HTMLElement;
      left = ele.offsetLeft;
      if (ele.offsetWidth !== tabsItemWidth.current) {
        width = ele.offsetWidth;
      }
    } else {
      left = (currentTarget as HTMLElement).offsetLeft;
      if (currentTarget.offsetWidth !== tabsItemWidth.current) {
        width = currentTarget.offsetWidth;
      }
    }

    const style: IActiveBarStyle = {
      width: width + 'px',
      left: left + 'px',
    };
    setActiveBarStyle(style);
  };
  const handleClick = (
    e: MouseEvent,
    index: number,
    disabled: boolean | undefined,
  ) => {
    if (!disabled) {
      setActiveIndex(index);
      if (type === 'line' && animated) {
        changeBarStyle(e.currentTarget as HTMLElement, index);
      }
      onChange && onChange(index);
    }
  };
  // 当前是否为激活项
  const isActive = (index: number) => index === activeIndex;
  // 是否渲染Bar组件
  const isRenderBar = () => type === 'line' && animated;
  // 渲染头部导航栏标签
  const renderNavLinks = () => {
    return Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<TabPaneProps>;
      const { label, disabled, tab } = childElement.props;
      const classes = classNames('simple-tabs-nav-item', {
        'is-active': activeIndex === index,
        disabled: disabled,
        'is-active-bottom-bar': activeIndex === index && !animated,
      });
      let childEle: ReactNode;
      if (tab) {
        childEle = typeof tab === 'function' ? tab(index) : tab;
      } else {
        childEle = label;
      }
      return (
        <li
          className={classes}
          key={`nav-item-${index}`}
          onClick={(e: MouseEvent) => {
            handleClick(e, index, disabled);
          }}
        >
          <div> {childEle}</div>
        </li>
      );
    });
  };

  const renderContent = () => {
    return Children.map(children, (child, index) => {
      const displayStyle = isActive(index) ? 'block' : 'none';
      // 如果当前项是否激活则添加到cacheChildren里面
      if (isActive(index)) {
        cacheChildrenIndex.current.push(index);
      }
      // 判断是否需要渲染child, 减少不必要的渲染开销
      const isRenderChild = cacheChildrenIndex.current.includes(index);
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
      <div className={navClass} style={centerStyle}>
        <ul ref={tabsListRef} className="tabsList">
          {renderNavLinks()}
          {isRenderBar() && renderAnimateBar()}
        </ul>
      </div>
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
