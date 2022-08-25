## AnimateList-动画列表

### 基础演示

```tsx
import React, { useState } from 'react';
import { AnimateList, Button, Space } from 'leaf-ui';

export default () => {
  let [list, setList] = useState(['react', 'vue', 'angular']);
  return (
    <div>
      <AnimateList
        items={list}
        keys={(item) => item}
        buildItem={(item, index) => {
          return (
            <div
              style={{
                background: 'lightgray',
                padding: '5px',
                textAlign: 'center',
                color: 'black',
                width: '400px',
                lineHeight: '40px',
                marginTop: index === 0 ? '0' : '10px',
              }}
              onClick={() => {
                setList((prev) => prev.filter((v) => v !== item));
              }}
            >
              {item}
            </div>
          );
        }}
      />
      <Space style={{ marginTop: '20px' }} itemStyle={{ marginTop: '10px' }}>
        <Button
          onClick={() => {
            setList((prev) => {
              let arr = [...prev];
              arr.splice(1, 0, Math.random());
              return arr;
            });
          }}
        >
          add
        </Button>
      </Space>
    </div>
  );
};
```

### 不同过渡

```tsx
import React, { useState } from 'react';
import { AnimateList, Button, Space } from 'leaf-ui';

export default () => {
  let [list, setList] = useState(['react', 'vue', 'angular']);
  function randomSort(arr) {
    let cloneArr = arr.slice();
    for (let i = 0, len = arr.length; i < len; i++) {
      let rand = parseInt(Math.random() * len);
      let temp = cloneArr[rand];
      cloneArr[rand] = cloneArr[i];
      cloneArr[i] = temp;
    }
    return cloneArr;
  }
  return (
    <div>
      <AnimateList
        items={list}
        keys={(item) => item}
        effect="slide-down"
        buildItem={(item, index) => {
          return (
            <div
              style={{
                background: 'lightgray',
                padding: '5px',
                textAlign: 'center',
                color: 'black',
                width: '400px',
                lineHeight: '40px',
                marginTop: index === 0 ? '0' : '10px',
              }}
              onClick={() => {
                setList((prev) => prev.filter((v) => v !== item));
              }}
            >
              {item}
            </div>
          );
        }}
      />
      <Button
        onClick={() => {
          setList((prev) => {
            let arr = [...prev];
            arr.splice(1, 0, Math.random());
            return arr;
          });
        }}
      >
        add
      </Button>
    </div>
  );
};
```
### 开启flip动画
```tsx
import React, { useState } from 'react';
import { AnimateList, Button, Space } from 'leaf-ui';

export default () => {
  let [list, setList] = useState(['react', 'vue', 'angular']);
  function randomSort(arr) {
    let cloneArr = arr.slice();
    for (let i = 0, len = arr.length; i < len; i++) {
      let rand = parseInt(Math.random() * len);
      let temp = cloneArr[rand];
      cloneArr[rand] = cloneArr[i];
      cloneArr[i] = temp;
    }
    return cloneArr;
  }
  return (
    <div>
      <AnimateList
        items={list}
        effect="side-slide"
        keys={(item) => item}
        buildItem={(item, index) => {
          return (
            <div
              style={{
                background: 'lightgray',
                padding: '5px',
                textAlign: 'center',
                color: 'black',
                width: '400px',
                lineHeight: '40px',
                marginTop: index === 0 ? '0' : '10px',
              }}
              onClick={() => {
                setList((prev) => prev.filter((v) => v !== item));
              }}
            >
              {item}
            </div>
          );
        }}
      />
      <Space style={{ marginTop: '20px' }} itemStyle={{ marginTop: '10px' }}>
        <Button
          onClick={() => {
            setList((prev) => {
              let arr = [...prev];
              arr.splice(1, 0, Math.random());
              return arr;
            });
          }}
        >
          add
        </Button>
        <Button onClick={() => setList(randomSort)}>shuffle</Button>
      </Space>
    </div>
  );
};
```
<API src="./AnimateList.tsx">
