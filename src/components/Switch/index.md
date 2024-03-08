## Switch-开关

### 基本演示

```tsx
import React, { useState } from 'react';
import { Switch, Space } from 'leaf-react-ui';

export default () => {
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };
  return <Switch defaultChecked onChange={onChange} />;
};
```

### 不同大小

```tsx
import React, { useState } from 'react';
import { Switch, Space } from 'leaf-react-ui';

export default () => {
  return (
    <Space>
      <Switch defaultChecked size="small" />
      <Switch size="medium" />
      <Switch size="large" />
    </Space>
  );
};
```

### 不可用

```tsx
import React, { useState } from 'react';
import { Switch, Space, Button } from 'leaf-react-ui';

export default () => {
  const [disabled, setDisabled] = useState(true);

  const toggle = () => {
    setDisabled(!disabled);
  };
  return (
    <Space>
      <Switch disabled={disabled} />
      <Button onClick={toggle}>toggle disabled</Button>
    </Space>
  );
};
```

### 自定义选中内容

```tsx
import React, { useState } from 'react';
import { Switch, Space } from 'leaf-react-ui';

export default () => {
  return (
    <Space>
      <Switch checkedChildren="开启" unCheckedChildren="关闭" size="medium" />
      <Switch checkedChildren="1" unCheckedChildren="0" size="large" />
      <Switch checkedChildren={<span>1</span>} unCheckedChildren={<span>0</span>} size="small" />
    </Space>
  );
};
```

### 加载中

```tsx
import React, { useState } from 'react';
import { Switch, Space } from 'leaf-react-ui';

export default () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setChecked(!checked);
    }, 1000);
  };
  return (
    <Space>
      <Switch loading defaultChecked />
      <Switch size="small" onClick={handleClick} loading={loading} checked={checked} />
    </Space>
  );
};
```

<API src="./Switch.tsx">
