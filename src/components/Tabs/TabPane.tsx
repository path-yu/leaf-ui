import { FC } from 'react';

export interface TabPaneProps {
  label: string;
  disabled?:boolean
}
const TabPane: FC<TabPaneProps> = ({  children, label }) => {
  return <div className="simple-tab-panel">{children}</div>;
};

TabPane.displayName = 'TabPane'
export default TabPane
