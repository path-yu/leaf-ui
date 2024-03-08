## Button-按钮

页面中最常用的的按钮元素，适合于完成特定的交互，支持 HTML button 和 a 链接 的所有属性支持设置不同大小,不同类型,不同形状使用

### 默认的的 Button

```tsx
import React from 'react';
import { Button } from 'leaf-react-ui';

export default () => <Button>Test</Button>;
```

### 不同尺寸的 Button

```tsx
import React from 'react';
import { Button, Space } from 'leaf-react-ui';

export default () => (
  <Space align="center">
    <Button size="lg"> large button </Button>
    <Button size="sm"> small button </Button>
  </Space>
);
```

### 不同类型的 Button

```tsx
import React from 'react';
import { Button, Space } from 'leaf-react-ui';

export default () => (
  <Space>
    <Button btnType="primary"> primary button </Button>
    <Button btnType="danger"> danger button </Button>
    <Button btnType="link" href="https://google.com">
      {' '}
      link button{' '}
    </Button>
  </Space>
);
```

### 不同形状的的 Button

```tsx
import React from 'react';
import { Button, Space } from 'leaf-react-ui';

export default () => (
  <Space>
    <Button share="circle"> primary button </Button>
    <Button share="round"> danger button </Button>
  </Space>
);
```

<API  src="./Button.Api.tsx">
