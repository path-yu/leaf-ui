import { FC } from 'react';

export interface TabPaneProps {
  index: string;
  label: string;
}
const TabPane: FC<TabPaneProps> = ({ index, children, label }) => {
  return <li>{label}</li>;
};

TabPane.displayName = 'TabPane'
export default TabPane
