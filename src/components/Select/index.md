## Select-选择器

一个简单的下拉选择器

## 简单演示

```tsx
import { Select } from 'ease-element';
import React from 'react';
const action = (value) => {
  console.log(value);
};
const defaultSelect = () => (
  <Select placeholder="请选择" onChange={action} onVisibleChange={action}>
    <Select.Option value="nihao" />
    <Select.Option value="nihao2" />
    <Select.Option value="nihao3" />
    <Select.Option value="disabled" disabled />
    <Select.Option value="nihao5" />
  </Select>
);
export default defaultSelect;
```

## 多选的 Select

```tsx
import { Select } from 'ease-element';
import React from 'react';
const action = (value) => {
  console.log(value);
};
const multipleSelect = () => (
  <Select
    placeholder="支持多选欧！"
    onChange={action('changed')}
    onVisibleChange={action('visible')}
    multiple
  >
    <Select.Option value="nihao" />
    <Select.Option value="nihao2" />
    <Select.Option value="nihao3" />
    <Select.Option value="viking" />
    <Select.Option value="viking2" />
  </Select>
);

export default multipleSelect;
```

## 被禁用的 Select

```tsx
import { Select } from 'ease-element';
import React from 'react';

const disabledSelect = () => (
  <Select placeholder="禁用啦！" disabled>
    <Select.Option value="nihao" />
    <Select.Option value="nihao2" />
    <Select.Option value="nihao3" />
  </Select>
);

export default disabledSelect;
```

### SelectApi

<API hideTitle src="./select.tsx">

### OptionApi

<API hideTitle src="./option.tsx">
