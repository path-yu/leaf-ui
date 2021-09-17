## Alert-警告提示

警告提示，展现需要关注的信息。

### 一个简单的 Alert

```tsx
import React from 'react';
import { Alert } from 'ease-element';
export default () => {
  return <Alert title="this is alert!"></Alert>;
};
```

### 不同类型的 Alert

```tsx
import React from 'react';
import { Alert } from 'ease-element';
const stylesAlert = () => {
  return (
    <>
      <Alert title="this is Success" type="success"></Alert>
      <Alert title="this is Danger!" type="danger"></Alert>
      <Alert title="this is Warning!" type="warning" closable={false}></Alert>
    </>
  );
};
export default stylesAlert;
```

### 不同描述的 Alert

```tsx
import React from 'react';
import { Alert } from 'ease-element';
const descriptionAlert = () => (
  <Alert
    title="提示标题欧亲"
    description="this is a long description"
    onClose={() => alert('close')}
  ></Alert>
);

export default descriptionAlert;
```

### API

<API hideTitle>
