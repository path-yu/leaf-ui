## InfiniteScroll 无限滚动

滚动到底部时，加载更多数据。

### 基础演示

通过给指定需要滚动加载的列表包裹 `InfiniteScroll`，并指定对应的加载方法即可，在 load 方法中调用传入副作用函数更新加载状态即可。

```tsx
import React, { useEffect, useState } from 'react';
import { InfiniteScroll } from 'leaf-react-ui';

export default () => {
  let [list, setList] = useState([]);
  const load = (effect) => {
    //  模拟异步加载数据
    setTimeout(() => {
      setList((prev) => {
        let noMore = prev.length === 60 ? true : false;
        effect?.(noMore);
        return noMore ? prev : prev.concat(Array.from(new Array(20)));
      });
    }, 1000);
  };
  useEffect(() => load(), []);
  return (
    <>
      <InfiniteScroll load={load}>
        {list.map((item, index) => {
          return <p key={index}>{index}</p>;
        })}
      </InfiniteScroll>
    </>
  );
};
```

<API src="InfiniteScroll.tsx">
