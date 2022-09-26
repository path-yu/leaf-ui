## Slider-选择器

```tsx
import React from 'react';
import { Slider, Space } from 'leaf-ui';
export default () => {
  return (
    <>
      <div style={{ width: '370px' }}>
        <Slider defaultValue={20} />
        <Slider range defaultValue={[20, 50]} />
      </div>
    </>
  );
};
```
