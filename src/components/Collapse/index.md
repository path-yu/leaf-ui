## Collapse 折叠面板

可以折叠/展开内容区域。

### 基础演示

```tsx
import React from 'react';
import { Collapse, CollapseItem } from 'leaf-react-ui';
export default () => (
  <Collapse>
    <CollapseItem title="JavaScript" name="1">
      <div>nodejs</div>
      <div>vue</div>
      <div>react</div>
    </CollapseItem>
    <CollapseItem title="java" name="2">
      <div>springBoot</div>
      <div>myBatisPlus</div>
      <div>shiro</div>
      <div>Redis</div>
      <div>mysql</div>
    </CollapseItem>
  </Collapse>
);
```

### 手风琴效果

```tsx
import React from 'react';
import { Collapse, CollapseItem } from 'leaf-react-ui';
export default () => (
  <Collapse accordion>
    <CollapseItem title="JavaScript" name="1">
      <div>nodejs</div>
      <div>vue</div>
      <div>react</div>
    </CollapseItem>
    <CollapseItem title="java" name="2">
      <div>springBoot</div>
      <div>myBatisPlus</div>
      <div>shiro</div>
      <div>Redis</div>
      <div>mysql</div>
    </CollapseItem>
  </Collapse>
);
```

### 箭头位置

通过 arrowPlacement 来设定箭头的位置。

```tsx
import React from 'react';
import { Collapse, CollapseItem } from 'leaf-react-ui';
export default () => (
  <Collapse arrowPlacement="right">
    <CollapseItem title="JavaScript" name="1">
      <div>nodejs</div>
      <div>vue</div>
      <div>react</div>
    </CollapseItem>
    <CollapseItem title="java" name="2">
      <div>springBoot</div>
      <div>myBatisPlus</div>
      <div>shiro</div>
      <div>Redis</div>
      <div>mysql</div>
    </CollapseItem>
  </Collapse>
);
```

### 点击标题

```tsx
import React from 'react';
import { Collapse, CollapseItem } from 'leaf-react-ui';
const handleItemHeaderClick = (data) => {
  console.log(data.name);
};
export default () => (
  <Collapse onItemHeaderClick={handleItemHeaderClick}>
    <CollapseItem title="JavaScript" name="1">
      <div>nodejs</div>
      <div>vue</div>
      <div>react</div>
    </CollapseItem>
    <CollapseItem title="java" name="2">
      <div>springBoot</div>
      <div>myBatisPlus</div>
      <div>shiro</div>
      <div>Redis</div>
      <div>mysql</div>
    </CollapseItem>
  </Collapse>
);
```

### 自定义图标

```tsx
import React from 'react';
import { Collapse, CollapseItem, Icon } from 'leaf-react-ui';

export default () => (
  <Collapse>
    <CollapseItem icon={<Icon icon="chalkboard-teacher" />} title="前端" name="1">
      <div>html+css</div>
      <div>JavaScript</div>
    </CollapseItem>
    <CollapseItem icon={<Icon icon="chalkboard-teacher" />} title="后端" name="2">
      <div>java</div>
      <div>rust</div>
      <div>golang</div>
      <div>nodejs</div>
      <div>bun</div>
    </CollapseItem>
  </Collapse>
);
```

### 额外内容

```tsx
import React from 'react';
import { Collapse, CollapseItem, Icon } from 'leaf-react-ui';

export default () => (
  <Collapse>
    <CollapseItem headerExtra={<span>我是左侧内容</span>} title="前端" name="1">
      <div>html+css</div>
      <div>JavaScript</div>
    </CollapseItem>
    <CollapseItem headerExtra={<span>很长很长很长的文字...</span>} title="后端" name="2">
      <div>java</div>
      <div>rust</div>
      <div>golang</div>
      <div>nodejs</div>
      <div>bun</div>
    </CollapseItem>
  </Collapse>
);
```

### 嵌套面板

```tsx
import React from 'react';
import { Collapse, CollapseItem } from 'leaf-react-ui';
export default () => (
  <Collapse>
    <CollapseItem title="JavaScript" name="1">
      <Collapse>
        <CollapseItem title="vue" name="1">
          <div>vue-router</div>
          <div>vuex</div>
          <div>react</div>
        </CollapseItem>
        <CollapseItem title="react" name="2">
          <div>redux</div>
          <div>recoli</div>
          <div>react-router</div>
          <div>Redis</div>
        </CollapseItem>
      </Collapse>
    </CollapseItem>
    <CollapseItem title="java" name="2">
      <div>springBoot</div>
      <div>myBatisPlus</div>
      <div>shiro</div>
      <div>Redis</div>
      <div>mysql</div>
    </CollapseItem>
  </Collapse>
);
```

### 默认展开

除了使用 accordion 情况下，defaultExpandedNames 都应该传入数组。

```tsx
import React from 'react';
import { Collapse, CollapseItem, Icon } from 'leaf-react-ui';

export default () => (
  <Collapse defaultExpandedNames={['1', '2']}>
    <CollapseItem headerExtra={<span>我是左侧内容</span>} title="前端" name="1">
      <div>html+css</div>
      <div>JavaScript</div>
    </CollapseItem>
    <CollapseItem headerExtra={<span>很长很长很长的文字...</span>} title="后端" name="2">
      <div>java</div>
      <div>rust</div>
      <div>golang</div>
      <div>nodejs</div>
      <div>bun</div>
    </CollapseItem>
  </Collapse>
);
```

### CollapseApi

<API hideTitle  src="./Collapse.tsx">

### CollapseItemApi

<API hideTitle src="./CollapseItem.tsx">
