## BaseTransition-过渡效果

### Fade 淡入淡出

```tsx
import React, { useState } from 'react';
import { Fade, Switch } from 'leaf-react-ui';
export default () => {
  const [checked, setChecked] = useState(true);

  const handleChange = (value) => {
    setChecked(value);
  };
  return (
    <>
      <Switch checked={checked} onChange={handleChange}></Switch>
      <span>show</span>
      <Fade value={checked} style={{ marginTop: '20px' }}>
        <div style={{ width: '80px', height: '80px', background: '#ccc' }}></div>
      </Fade>
    </>
  );
};
```

### Collapse 折叠渐变

设置 `horizontal`开启水平方向过渡，`collapsedSize`指定未展开时的高度值或宽度值。

```tsx
import React, { useState } from 'react';
import { CollapseTransition, Switch, Space } from 'leaf-react-ui';
export default () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (value) => {
    setChecked(value);
  };
  return (
    <>
      <Space>
        <div>
          <Switch checked={checked} onChange={handleChange}></Switch>
          <span>show</span>
        </div>
        <CollapseTransition value={checked}>
          <div style={{ width: '80px', height: '80px', background: '#ccc' }}></div>
        </CollapseTransition>
        <CollapseTransition value={checked} collapsedSize={20}>
          <div style={{ width: '80px', height: '80px', background: '#ccc' }}></div>
        </CollapseTransition>
        <CollapseTransition value={checked} collapsedSize={20} horizontal>
          <div style={{ width: '80px', height: '80px', background: '#ccc' }}></div>
        </CollapseTransition>
        <CollapseTransition value={checked} horizontal>
          <div style={{ width: '80px', height: '80px', background: '#ccc' }}></div>
        </CollapseTransition>
      </Space>
    </>
  );
};
```

### Zoom 放大

```tsx
import React, { useState } from 'react';
import { Zoom, Switch, Space } from 'leaf-react-ui';
export default () => {
  const [checked, setChecked] = useState(true);

  const handleChange = (value) => {
    setChecked(value);
  };
  return (
    <>
      <Switch checked={checked} onChange={handleChange}></Switch>
      <span>show</span>
      <Space>
        <Zoom value={checked} wrap={false} style={{ display: 'inline-block' }}>
          <div style={{ width: '80px', height: '80px', background: '#ccc' }}></div>
        </Zoom>
        <Zoom
          value={checked}
          style={{ transitionDelay: checked ? '500ms' : '0ms', display: 'inline-block' }}
        >
          <div style={{ width: '80px', height: '80px', background: '#ccc' }}></div>
        </Zoom>
      </Space>
    </>
  );
};
```

### 公共参数

尽管上面没有列举来自`react-transition-group`的[Transition](http://reactcommunity.org/react-transition-group/transition#Transition-props) 组件的 props，你也可以在组件上添加相应的 props。

<API hideTitle src="./Api/CommonTransitionProps.tsx">
