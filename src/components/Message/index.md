## 全局提示-message

全局操作反馈信息展示

### 基础演示

```tsx
import React from 'react';
import { message, Button } from 'leaf-ui';

export default () => {
  return (
    <div>
      <Button
        onClick={() => {
          message.info('this is message');
        }}
      >
        open info message
      </Button>
    </div>
  );
};
```

### 不同提示类型

```tsx
import React from 'react';
import { message, Button, Space } from 'leaf-ui';

export default () => {
  return (
    <Space>
      <Button
        onClick={() => {
          message.info('this is modal message');
        }}
      >
        open info message
      </Button>
      <Button
        onClick={() => {
          message.warning('this is warning message');
        }}
      >
        open warning message
      </Button>
      <Button
        onClick={() => {
          message.success('this is success message');
        }}
      >
        open success message
      </Button>
    </Space>
  );
};
```

### 修改延时

自定义延时为 8s，默认为 3s，设置为 0 则会一直显示。

```tsx
import React from 'react';
import { message, Button, Space } from 'leaf-ui';

export default () => {
  return (
    <Button
      onClick={() => {
        message.info('this is modal message', 8);
      }}
    >
      open info message
    </Button>
  );
};
```

### 加载中

开启全局 loading，可自行异步关闭

```tsx
import React from 'react';
import { message, Button, Space } from 'leaf-ui';

export default () => {
  return (
    <Button
      onClick={() => {
        const hide = message.loading('this is modal message', 0);
        setTimeout(hide, 3000);
      }}
    >
      show loading message
    </Button>
  );
};
```

### Promise 接口

可以通过 then 接口在关闭后运行 callback，实现当每个 message 将要关闭时通过 then 回调开启新的 message

```tsx
import React from 'react';
import { message, Button, Space } from 'leaf-ui';

export default () => {
  return (
    <Button
      onClick={() => {
        message
          .loading('Action in progress..', 2.5)
          .then(() => message.success('Loading finished', 2.5))
          .then(() => message.info('Loading finished is finished', 2.5));
      }}
    >
      Display sequential messages
    </Button>
  );
};
```
### 自定义样式
通过style和className来自定义样式
```tsx
import React from 'react';
import { message, Button, Space } from 'leaf-ui';

export default () => {
  return (
    <Button
      onClick={() => {
        message.success({
          content: 'This is a prompt message with custom className and style',
          className: 'custom-class',
          style: {
            marginTop: '20vh',
          },
        });
      }}
    >
      Customized style
    </Button>
  );
};
```
### API
组件提供了一些静态方法，使用方式和参数如下：
* `message.success(content, [duration], onClose)`

* `message.error(content, [duration], onClose)`

* `message.info(content, [duration], onClose)`

* `message.warning(content, [duration], onClose)`

* `message.warn(content, [duration], onClose)`

* ` message.loading(content, [duration], onClose)`

| 参数      | 说明   | 类型          | 默认值 |
|---------|------|-------------|:---:|
| content | 提升内容 | `ReactNode` |  -  |
| duration    | 	自动关闭的延时，单位秒。设为 0 时不自动关闭     | `number`    |  3  |
| onClose     |   	关闭时触发的回调函数   |      `function`       |  -  |

组件同时提供 promise 接口。

* `message[level](content, [duration]).then(afterClose)`

* `message[level](content, [duration], onClose).then(afterClose)`

其中 `message[level]` 是组件已经提供的静态方法。then 接口返回值是 Promise。

也可以对象的形式传递参数：

* `message.open(config)`
* `message.success(config)`
* `message.error(config)`
* `message.info(config)`
* `message.warning(config)`
* `message.warn(config)` // alias of warning
* `message.loading(config)`

`config` 对象属性如下：

| 参数  | 说明  | 类型        | 默认值 |
|-----|-----|-----------|-----|
|  className  |  自定义 CSS class   | `string`    | -   |
|  content  | 提示内容    | `ReactNode` |     |
|  duration  |  	自动关闭的延时，单位秒。设为 0 时不自动关闭   | `number`          | 3   |
|   icon  |  	自定义图标   |  `ReactNode`         | -   |
|  style   |   自定义内联样式  |     `	CSSProperties`      | -   |
|  onClick  |  点击 message 时触发的回调函数   |  	`function`         | -   |
|  onClose  |  关闭时触发的回调函数                      |    `function`                | -   |
