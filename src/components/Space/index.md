## Space-间距

### 演示
```tsx
import { Space,Button } from 'leaf-ui';
import React from 'react';

const defaultDemo = () => (
  <Space size="large" wrap={true}>
    <Button>hello world</Button>
    <Button>hello world </Button>
    <Button>hello world </Button>
    <Button>wow this is button... </Button>
    <Button>wow this is button... </Button>
    <Button>wow this is button... </Button>
  </Space>
);
export default defaultDemo;
```

### 垂直对齐
```tsx
import { Space,Button } from 'leaf-ui';
import React from 'react';

const defaultDemo = () => (
  <Space size="large" vertical>
    <Button>hello world</Button>
    <Button>hello world </Button>
    <Button>hello world </Button>
    <Button>wow this is button... </Button>
  </Space>
);
export default defaultDemo;
```
### 自定义间距
```tsx
import { Space,Button } from 'leaf-ui';
import React from 'react';

const defaultDemo = () => (
  <Space size={[30,40]} >
    <Button>hello world</Button>
    <Button>hello world </Button>
    <Button>hello world </Button>
    <Button>wow this is button... </Button>
  </Space>
);
export default defaultDemo;
```
### 尾部对齐
```tsx
import { Space,Button } from 'leaf-ui';
import React from 'react';

const defaultDemo = () => (
  <Space justify="end" >
    <Button>hello world</Button>
    <Button>hello world </Button>
    <Button>hello world </Button>
    <Button>wow this is button... </Button>
  </Space>
);
export default defaultDemo;
```

### 从中间
```tsx
import { Space,Button } from 'leaf-ui';
import React from 'react';

const defaultDemo = () => (
  <Space justify="center" >
    <Button>hello world</Button>
    <Button>hello world </Button>
    <Button>hello world </Button>
    <Button>wow this is button... </Button>
  </Space>
);
export default defaultDemo;
```

### 空间环绕

```tsx
import { Space,Button } from 'leaf-ui';
import React from 'react';

const defaultDemo = () => (
  <Space justify="space-around" >
    <Button>hello world</Button>
    <Button>hello world </Button>
    <Button>hello world </Button>
    <Button>wow this is button... </Button>
  </Space>
);
export default defaultDemo;
```
<API src="./Space.tsx">
