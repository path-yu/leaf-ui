## Icon-图标

语义化的矢量图形。使用图标组件,基于 react-fontawesome 二次开发

### 简单演示

```tsx
import React from 'react';
import { Icon, Button } from 'ease-element';
const defaultIcons = () => (
  <>
    <Icon icon="check" size="3x" />
    <Icon icon="times" size="3x" />
    <Icon icon="anchor" size="3x" />
    <Icon icon="trash" size="3x" />
    <Button size="lg" btnType="primary">
      <Icon icon="check" /> check{' '}
    </Button>
  </>
);
export default defaultIcons;
```

### 不同主题的图标

```tsx
import React from 'react';
import { Icon, Button } from 'ease-element';
const themeIcons = () => (
  <>
    <Icon icon="check" size="3x" theme="success" />
    <Icon icon="times" size="3x" theme="danger" />
    <Icon icon="anchor" size="3x" theme="primary" />
    <Icon icon="exclamation-circle" size="3x" theme="warning" />
  </>
);
export default themeIcons;
```

### 自定义图标大小

```tsx
import React from 'react';
import { Icon, Button } from 'ease-element';
const customIcons = () => (
  <>
    <Icon icon="spinner" size="3x" theme="primary" spin />
    <Icon icon="spinner" size="5x" theme="success" pulse />
  </>
);

export default customIcons;
```

<API src="./Icon.api.tsx"></API>
