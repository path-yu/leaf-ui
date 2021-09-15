---
nav:
  title: Components
  path: /components
---

# Tabs

选项卡切换组件。

### 使用场景

提供平级的区域将大块内容进行收纳和展现，保持界面整洁。

### 引用方法

```ts
import { Tabs } from 'react-element';
```

### 基本使用

```tsx
import { Tabs, TabPane } from 'react-element';
import React from 'react';
function action(index) {
  console.log(index);
}
export default () => (
  <Tabs onSelect={action}>
    <TabPane label="选项卡一">this is content one</TabPane>
    <TabPane label="选项卡二">this is content two</TabPane>
    <TabPane label="用户管理">this is content three</TabPane>
  </Tabs>
);
```

### 居中

给 Tabs 添加一个居中的样式

```tsx
import { Tabs, TabPane } from 'react-element';
import React from 'react';
export default () => (
  <Tabs centered={true}>
    <TabPane label="选项卡一">this is content one</TabPane>
    <TabPane label="选项卡二">this is content two</TabPane>
    <TabPane label="用户管理">this is content three</TabPane>
  </Tabs>
);
```

### 动画

为 Tabs 切换添加动画

activeBarMode 指定底部导航栏的显示模式

```tsx
import { Tabs, TabPane } from 'react-element';
import React from 'react';
export default () => (
  <div>
    <Tabs animated={true} activeBarMode="fill">
      <TabPane label="选项卡一">this is content one</TabPane>
      <TabPane label="选项卡二">this is content two</TabPane>
      <TabPane label="用户管理">this is content three</TabPane>
    </Tabs>
    <Tabs animated={true} activeBarMode="center">
      <TabPane label="选项卡一">this is content one</TabPane>
      <TabPane label="选项卡二">this is content two</TabPane>
      <TabPane label="用户管理">this is content three</TabPane>
    </Tabs>
  </div>
);
```

### 卡片

卡片风格的标签页

```tsx
import { Tabs, TabPane } from 'react-element';
import React from 'react';
export default () => (
  <Tabs type="card">
    <TabPane label="选项卡一">this is content one</TabPane>
    <TabPane label="选项卡二">this is content two</TabPane>
    <TabPane label="用户管理">this is content three</TabPane>
  </Tabs>
);
```

### 自定义 tab

tab 属性接受一个 render 函数或 jsx

```tsx
import { Tabs, TabPane } from 'react-element';
import React from 'react';
export default () => (
  <Tabs>
    <TabPane tab={() => <span>自定义选项</span>}>this is content one</TabPane>
    <TabPane label="选项卡二">this is content two</TabPane>
    <TabPane label="用户管理">this is content three</TabPane>
  </Tabs>
);
```

### TabsApi

<API hideTitle exports='["default"]' src="./Api.tsx"><API>

### TabsPaneApi

<API hideTitle  exports='["default"]' src="./tab-pane.tsx"><API>
