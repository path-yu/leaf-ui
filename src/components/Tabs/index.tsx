import { FC } from 'react';
import TabPane, { TabPaneProps } from './tab-pane';
import Tabs, { TabsProps } from './tabs';

export type ITabsComponent = FC<TabsProps> & {
  Pane: FC<TabPaneProps>;
};
const TransTabs = Tabs as ITabsComponent;
TransTabs.Pane = TabPane;

export default TransTabs;
