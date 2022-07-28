## 图像-Image

### 基础演示

预览一下

```tsx
import React from 'react';
import { Image } from 'leaf-ui';
export default () => {
  return (
    <Image
      placeHolder={
        <div
          style={{
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0001',
          }}
        >
          Loading....
        </div>
      }
      width={100}
      src="https://avatars.githubusercontent.com/u/59117479?v=4"
    />
  );
};
```

### 图片组使用

```tsx
import React from 'react';
import { Image, ImageGroup } from 'leaf-ui';

export default () => {
  return (
    <ImageGroup>
      <Image
        width={100}
        src="https://upload.jianshu.io/users/upload_avatars/20032554/c958591a-bed0-405c-b68b-ca2095a5e669.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240"
      />
      <Image width={100} src="https://avatars.githubusercontent.com/u/59117479?v=4" />
    </ImageGroup>
  );
};
```

### 加载失败

指定 fallbackSrc 设置失败时的图像

```tsx
import React from 'react';
import { Image } from 'leaf-ui';
export default () => {
  return (
    <Image
      width={100}
      fallbackSrc="https://avatars.githubusercontent.com/u/59117479?v=4"
      src="哔哩哔哩"
    />
  );
};
```

### 禁止预览

通过指定`previewDisabled`禁止预览

```tsx
import React from 'react';
import { Image } from 'leaf-ui';
export default () => {
  return (
    <Image width={100} src="https://avatars.githubusercontent.com/u/59117479?v=4" previewDisabled />
  );
};
```

### 是否展示工具栏

通过指定`showToolBar`为 false 不展示工具栏

```tsx
import React from 'react';
import { Image } from 'leaf-ui';
export default () => {
  return (
    <Image
      width={100}
      src="https://avatars.githubusercontent.com/u/59117479?v=4"
      showToolbar={false}
    />
  );
};
```

### 懒加载

你可以指定 lazy 属性开启懒加载,使图片进入视口开始加载

```tsx
import React from 'react';
import { Image } from 'leaf-ui';
export default () => {
  return (
    <div style={{ height: '200px', overflow: 'scroll' }}>
      <div style={{ height: '200px' }}>占位.....</div>
      <Image width={100} lazy src="https://avatars.githubusercontent.com/u/59117479?v=4" />
      <Image
        width={100}
        lazy
        src="https://upload.jianshu.io/users/upload_avatars/20032554/c958591a-bed0-405c-b68b-ca2095a5e669.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240"
      />
    </div>
  );
};
```

### 自定义触发点击预览事件类型

使用`triggerPreviewEventType`来设置是单击预览还是双击

```tsx
import React from 'react';
import { Image } from 'leaf-ui';
export default () => {
  return (
    <>
      <Image
        triggerPreviewEventType="onClick"
        width={100}
        src="https://avatars.githubusercontent.com/u/59117479?v=4"
      />
      <Image
        width={100}
        triggerPreviewEventType="onDoubleClick"
        src="https://upload.jianshu.io/users/upload_avatars/20032554/c958591a-bed0-405c-b68b-ca2095a5e669.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240"
      />
    </>
  );
};
```

### 设置图片加载中的占位

```tsx
import React from 'react';
import { Image } from 'leaf-ui';
export default () => {
  return (
    <Image
      width={100}
      placeHolder={
        <div
          style={{
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0001',
          }}
        >
          Loading....
        </div>
      }
      src="https://avatars.githubusercontent.com/u/59117479?v=4"
    />
  );
};
```
### Image Api
<API hideTitle src="./Api/Image.api.tsx">

### ImageGroup Api
<API hideTitle src="./ImageGroup.tsx">
