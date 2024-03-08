### useAsyncState

响应式异步状态，提供获取异步数据所需的`loading`,`error`,`state`响应式数据，在异步完成时执行状态的更改

```tsx
import React from 'react';
import { useAsyncState, Button, Space } from 'leaf-react-ui';
import axios from 'axios';
export default () => {
  const { isLoading, state, isReady, execute } = useAsyncState(
    (args) => {
      const id = args?.id || 1;
      return axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`).then((t) => t.data);
    },
    {},
    {
      delay: 2000,
    },
  );
  return (
    <>
      <Space vertical>
        <span>Ready: {isReady.toString()}</span>
        <span>Loading: {isLoading.toString()}</span>
        <pre lang="json">{state.title}</pre>
      </Space>
      <Button onClick={() => execute({ id: 2 })}>Execute</Button>
    </>
  );
};
```
