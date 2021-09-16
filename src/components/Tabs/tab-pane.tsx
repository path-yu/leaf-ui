import React, { FC, ReactNode } from 'react';

export type tabType = ReactNode | ((index: number) => ReactNode);
export interface TabPaneProps {
  /** tab标题 */
  label?: string;
  /** 是否禁用
   * @default false
   */
  disabled?: boolean;
  /** 自定义tab标题 */
  tab?: ReactNode | ((index: number) => ReactNode);
}
const TabPane: FC<TabPaneProps> = ({ children }) => {
  return <div className="simple-tab-panel">{children}</div>;
};

TabPane.displayName = 'TabPane';
export default TabPane;
