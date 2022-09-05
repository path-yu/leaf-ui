## checkbox-多选框

### 基本演示

```tsx
import { Checkbox } from 'leaf-ui';
import React, { ChangeEvent } from 'react';

export default () => {
  const onChange = (e: ChangeEvent) => {
    console.log(e.target.checked);
  };
  return <Checkbox onChange={onChange} >check Box</Checkbox>;
};
```

### 受控

```tsx
import { Checkbox, Button } from 'leaf-ui';
import React, { ChangeEvent, useState } from 'react';

export default () => {
  const [checked, setChecked] = useState(false);
  const onChange = (e: ChangeEvent) => {
    setChecked(e.target.checked);
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

### checkbox 组

```tsx
import { CheckboxGroup } from 'leaf-ui';
import React, { useState } from 'react';

const onChange = (e,checkedValues: CheckboxValueType[]) => {
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
  { label: 'Orange', value: 'Orange', disabled: true },
];

const App: React.FC = () => {
  const [checkValue, setCheckValue] = useState(['Orange']);
  return (
    <>
      <CheckboxGroup options={plainOptions} defaultValue={['Apple']} onChange={onChange} />
      <br />
      <br />
      <CheckboxGroup
        options={options}
        value={checkValue}
        onChange={(e, checkValue: string[]) => setCheckValue(checkValue)}
      />
      <br />
      <br />
      <CheckboxGroup
        disabled
        options={optionsWithDisabled}
        defaultValue={['Apple']}
        onChange={onChange}
      />
    </>
  );
};

export default App;
```

### 全选组

```tsx
import { CheckboxGroup, Checkbox } from 'leaf-ui';
import React, { useState } from 'react';

const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];

export default () => {
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const onChange = (e: ChangEvent, list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        Check all
      </Checkbox>
      <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
    </>
  );
};
```

### Checkbox Props

<API hideTitle src="CheckBox.tsx" />

### CheckboxGroup Props

<API hideTitle src="CheckBoxGroup.tsx" />
