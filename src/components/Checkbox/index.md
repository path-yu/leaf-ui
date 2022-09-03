## checkbox-多选框

### 基本演示

```tsx
import { Checkbox } from 'leaf-ui';
import React, { ChangeEvent } from 'react';

export default () => {
  const onChange = (e: ChangeEvent) => {
    console.log(e.target.checked);
  };
  return <Checkbox onChange={onChange}>check Box</Checkbox>;
};
```

### 受控

```tsx
import { Checkbox, Button } from 'leaf-ui';
import React, { ChangeEvent, useState } from 'react';

export default () => {
  const [checked, setChecked] = useState(false);
  const onChange = (e: ChangeEvent) => {
    setChecked(e.target.checked)
  };
  return (
    <div>
      <Checkbox checked={checked} onChange={onChange}>
        {checked ? 'checked' : 'unchecked'}
      </Checkbox>
      <Button onClick={() => setChecked(!checked)}>toggle Checked</Button>
    </div>
  );
};
```
### 不可用
```tsx
import { Checkbox } from 'leaf-ui';
import React from 'react';

export default () => (
  <>
    <Checkbox defaultChecked={false} disabled />
    <Checkbox defaultChecked disabled />
  </>
);
```
### 全选组
```tsx
import { CheckBoxGroup } from 'leaf-ui';
import React from 'react';

const onChange = (checkedValues: CheckboxValueType[]) => {
  console.log('checked = ', checkedValues);
};

const plainOptions = ['Apple', 'Pear', 'Orange'];
const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];
const optionsWithDisabled = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange', disabled: false },
];

const App: React.FC = () => (
  <>
    <CheckBoxGroup options={plainOptions} defaultValue={['Apple']} onChange={onChange} />
    <br />
    <br />
    <CheckBoxGroup options={options} value={['Orange']} onChange={onChange} />
    <br />
    <br />
    <CheckBoxGroup
      options={optionsWithDisabled}
      disabled
      defaultValue={['Apple']}
      onChange={onChange}
    />
  </>
);

export default App;
```
### Checkbox Props
<API hideTitle src="CheckBox.tsx" />

### CheckboxGroup Props
<API hideTitle src="CheckBoxGroup.tsx" />
