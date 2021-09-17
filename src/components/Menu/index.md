## Menu-导航菜单

为页面和功能提供导航的菜单列表。

### 简单演示

```tsx
import React from 'react';
import { Menu } from 'ease-element';
const defaultMenu = () => (
  <Menu defaultIndex="0" onSelect={(i) => console.log(i)}>
    <Menu.Item>cool link</Menu.Item>
    <Menu.Item>cool link 2</Menu.Item>
    <Menu.Item disabled>disabled</Menu.Item>
    <Menu.SubMenu title="下拉选项">
      <Menu.Item>下拉选项一</Menu.Item>
      <Menu.Item>下拉选项二</Menu.Item>
    </Menu.SubMenu>
  </Menu>
);
export default defaultMenu;
```

### 纵向的 Menu

```tsx
import React from 'react';
import { Menu } from 'ease-element';
const clickMenu = () => (
  <Menu defaultIndex="0" onSelect={(i) => console.log(i)} mode="vertical">
    <Menu.Item>cool link</Menu.Item>
    <Menu.Item>cool link 2</Menu.Item>
    <Menu.SubMenu title="默认展开下拉选项">
      <Menu.Item>下拉选项一</Menu.Item>
      <Menu.Item>下拉选项二</Menu.Item>
    </Menu.SubMenu>
  </Menu>
);
export default clickMenu;
```

### 默认展开的纵向 Menu

```tsx
import React from 'react';
import { Menu } from 'ease-element';
const openedMenu = () => (
  <Menu
    defaultIndex="0"
    onSelect={(i) => console.log(i)}
    mode="vertical"
    defaultOpenSubMenus={['2']}
  >
    <Menu.Item>cool link</Menu.Item>
    <Menu.Item>cool link 2</Menu.Item>
    <Menu.SubMenu title="默认展开下拉选项">
      <Menu.Item>下拉选项一</Menu.Item>
      <Menu.Item>下拉选项二</Menu.Item>
    </Menu.SubMenu>
  </Menu>
);

export default openedMenu;
```

<API src="./menu.tsx"></API>
