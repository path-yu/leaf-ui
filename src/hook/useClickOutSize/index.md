### useClickOutSize

在目标元素外点击触发钩子，函数接受一个 DOM 元素，和相应的处理函数。

```tsx
import { useClickOutSize, message } from 'leaf-ui';
import React, { useRef } from 'react';

export default () => {
  const target = useRef<HTMLDivElement>(null);
  const { targetIsClick } = useClickOutSize(target, () => {
    message.info('在目标元素外点击');
  });
  return (
    <div
      ref={target}
      style={{
        height: '100px',
        lineHeight: '100px',
      }}
    >
      target isCLick : {targetIsClick.toString()}
    </div>
  );
};
```

### props

| Name    | Description        | Type                     | Default |
| ------- | ------------------ | ------------------------ | ------- |
| ref     | 需要绑定的目标元素 | `RefObject<HTMLElement>` | `--`    |
| handler | 处理在外部点击钩子 | `() => void`             | `--`    |

### Return Type Declarations

```ts | pure
interface Result {
  /**
   * 目标元素是否被点击
   */
  targetIsClick: boolean;
}
```
