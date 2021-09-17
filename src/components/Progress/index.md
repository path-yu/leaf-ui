## Progress-进度条

展示操作的当前进度。

### 简单使用

```tsx
import { Progress } from 'ease-element';
import React from 'react';
const defaultProgress = () => {
  return (
    <>
      <Progress percent="60" />
    </>
  );
};
export default defaultProgress;
```

### 不同主题样式

```tsx
import { Progress } from 'ease-element';
import React from 'react';
const themeProgress = () => {
  return (
    <div>
      <Progress theme="secondary" percent="60" />
      <br />
      <Progress theme="success" percent="80" />
      <br />
      <Progress theme="warning" percent="50" />
      <br />
      <Progress theme="dark" percent="50" />
      <br />
      <Progress theme="danger" percent="50" />
    </div>
  );
};
export default themeProgress;
```

### 不显示进度值

```tsx
import { Progress } from 'ease-element';
import React from 'react';
const hideTextProgress = () => {
  return (
    <div>
      <Progress showText={false} theme="secondary" percent="60" />
    </div>
  );
};
export default hideTextProgress;
```

<API>
