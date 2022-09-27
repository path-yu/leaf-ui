## Slider-选择器

### 基本演示

```tsx
import React from 'react';
import { Slider, Space } from 'leaf-ui';
export default () => {
  return (
    <>
      <div>
        <Slider defaultValue={20} />
        <Slider
          range
          defaultValue={[20, 50]}
          onChange={(value) => {
            console.log(value);
          }}
        />
      </div>
    </>
  );
};
```

### 禁用

```tsx
import React from 'react';
import { Slider, Space } from 'leaf-ui';
export default () => {
  return (
    <>
      <div>
        <Slider defaultValue={20} disabled />
      </div>
    </>
  );
};
```

### 事件

当 Slider 的值发生改变时，会触发 `onChange` 事件，并把改变后的值作为参数传入。在 `onmouseup` 时，会触发 `onAfterChange` 事件，并把当前值作为参数传入。

```tsx
import React from 'react';
import { Slider, Space } from 'leaf-ui';
export default () => {
  const onChange = (value: number | [number, number]) => {
    console.log('onChange: ', value);
  };

  const onAfterChange = (value: number | [number, number]) => {
    console.log('onAfterChange: ', value);
  };
  return (
    <>
      <div>
        <Slider defaultValue={20} onChange={onChange} onAfterChange={onAfterChange} />
        <Slider range defaultValue={[20, 50]} onChange={onChange} onAfterChange={onAfterChange} />
      </div>
    </>
  );
};
```

### 垂直

垂直方向的 Slider

```tsx
import React from 'react';
import { Slider, Space } from 'leaf-ui';
export default () => {
  return (
    <>
      <div style={{ height: '370px', width: '300px', display: 'flex' }}>
        <Slider defaultValue={20} vertical reverse />
        <Slider range vertical defaultValue={[20, 50]} />
      </div>
    </>
  );
};
```

### 反向

```tsx
import { Slider, Switch } from 'leaf-ui';
import React, { useState } from 'react';

export default () => {
  const [reverse, setReverse] = useState(true);

  return (
    <>
      <Slider defaultValue={30} reverse={reverse} />
      <Slider range defaultValue={[20, 50]} reverse={reverse} onChange={(v)=>{
          console.log(v)
      }} />
      Reversed: <Switch size="small" checked={reverse} onChange={setReverse} />
    </>
  );
};
```
### 受控
```tsx
import { Slider } from 'leaf-ui';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState(30);

  return (
    <>
      <Slider value={value} onChange={setValue}  />
    </>
  );
};
```
<API src="./Slider.tsx">
