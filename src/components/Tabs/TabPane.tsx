import { FC, ReactNode } from 'react';

export type tabType = ReactNode |( (index:number) => ReactNode)
export interface TabPaneProps {
  label: string;
  disabled?: boolean;
  tab?: tabType;
}
const TabPane: FC<TabPaneProps> = ({ children }) => {

  return <div className="simple-tab-panel">{ children}</div>;
};

TabPane.displayName = 'TabPane'
export default TabPane
