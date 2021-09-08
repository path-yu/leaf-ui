import { Children, FC, FunctionComponentElement } from 'react';
import { TabPaneProps } from './TabPane';
interface TabsProps {
  // 初始化选中面板的 key，如果没有设置 activeKey
  defaultIndex?: string;
  // 切换面板的回调
  onChange: (index: string) => void;
  // 当前激活的tab key
  activeKey?: string;
  // 可扩展的className
  className?: string,
  // Tabs的样式类型, 两种可选 默认为line
  type?:'line' | 'card'
}

const Tabs: FC<TabsProps> = (props) => {
  const { defaultIndex, onChange, activeKey, children } = props;
  
  const renderChildren = () => {
    return Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<TabPaneProps>
      if (childElement.type.displayName === 'TabPane') {
        return child
      } else {
        console.error(
          'Warning: Menu has a child which is not a MenuItem component'
        );
      }
    })
  }
  return <div>{renderChildren()}</div>;
};
export default Tabs