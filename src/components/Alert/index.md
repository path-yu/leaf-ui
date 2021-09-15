## Alert

### 一个简单的 Alert

```tsx
import React from 'react';
import { Alert } from 'react-element';
export default () => {
  return <Alert title="this is alert!"></Alert>;
};
```

### 不同类型的 Alert

```tsx
import React from 'react';
import { Alert } from 'react-element';
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
import { Alert } from 'react-element';
const descriptionAlert = () => (
  <Alert
    title="提示标题欧亲"
    description="this is a long description"
    onClose={() => alert('close')}
  ></Alert>
);

export default descriptionAlert;
```

<API></API>
