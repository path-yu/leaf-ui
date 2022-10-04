### BaseTransition-过渡效果

Fade 淡入淡出

```tsx
import React, { useState } from 'react';
import { Fade, Switch } from 'leaf-ui';
export default () => {
  const [checked, setChecked] = useState(true);

  const handleChange = (value) => {
    setChecked(value);
  };
  return (
    <>
      <Switch checked={checked} onChange={handleChange}></Switch>
      <span>show</span>
      <Fade value={checked}>
        <div style={{ width: '200px', height: '200px', background: '#ccc' }}></div>
      </Fade>
    </>
  );
};
```

### 折叠面板

```tsx
import React, { useState } from 'react';
import { CollapseTransition, Switch } from 'leaf-ui';
export default () => {
  const [checked, setChecked] = useState(true);

  const handleChange = (value) => {
    setChecked(value);
  };
  return (
    <>
      <Switch checked={checked} onChange={handleChange}></Switch>
      <span>show</span>
      <CollapseTransition value={checked} collapsedHeight={20}>
        <div style={{ width: '200px', height: '200px', background: '#ccc' }}></div>
      </CollapseTransition>
    </>
  );
};
```

### 公共参数

尽管上面没有列举来自`react-transition-group`的[Transition](http://reactcommunity.org/react-transition-group/transition#Transition-props) 组件的 props，你也可以在组件上添加相应的 props。

<API hideTitle src="./Api/CommonTransitionProps.tsx">

