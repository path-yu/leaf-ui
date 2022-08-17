## Carousel-轮播图

### 基本演示

```tsx
import { Carousel } from 'leaf-ui';
import React from 'react';

export default () => {
  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    margin: '0',
  };
  return (
    <Carousel width="400px">
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
      />
    </Carousel>
  );
};
```
### 自动播放
设置`autoplay`即可自动播放

```tsx
import { Carousel } from 'leaf-ui';
import React from 'react';

export default () => {
  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    margin: '0',
  };
  return (
    <Carousel width="400px" autoplay interval="5000">
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
      />
    </Carousel>
  );
};
```
### 指示点
通过`dotType`来设置指示点类型，通过`showDots={false}`来隐藏指示点，通过`dotPosition`设置指示点位置
```tsx
import { Carousel } from 'leaf-ui';
import React from 'react';

export default () => {
  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    margin: '0',
  };
  return (
    <Carousel width="400px" dotType="line" dotPosition="left">
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
      />
    </Carousel>
  );
};
```
### 垂直
将`direction`指定为`vertical`即可
```tsx
import { Carousel } from 'leaf-ui';
import React from 'react';

export default () => {
  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    margin: '0',
  };
  return (
    <Carousel width="400px" direction="vertical">
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
      />
    </Carousel>
  );
};
```
### 渐显
切换效果为渐显。
```tsx
import { Carousel } from 'leaf-ui';
import React from 'react';

export default () => {
  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    margin: '0',
  };
  return (
    <Carousel width="400px" effect="fade">
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
      />
    </Carousel>
  );
};
```
### 鼠标经过指示点切换轮播图
设定`trigger`为`hover`鼠标经过指示点时触发切换。
```tsx
import { Carousel } from 'leaf-ui';
import React from 'react';

export default () => {
  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    margin: '0',
  };
  return (
    <Carousel width="400px" trigger="hover">
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
      />
    </Carousel>
  );
};
```
### 指定默认显示页
设定`defaultIndex`对应页数即可
```tsx
import { Carousel } from 'leaf-ui';
import React from 'react';

export default () => {
  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    margin: '0',
  };
  return (
    <Carousel width="400px" defaultIndex={2}>
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
      />
    </Carousel>
  );
};
```
### 循环播放
开启循环播放，会在前后各复制一个 slide ，让轮播图看上去切换上循环的，默认开启，通过`loop={false}`来关闭。
```tsx
import { Carousel } from 'leaf-ui';
import React from 'react';

export default () => {
  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    margin: '0',
  };
  return (
    <Carousel width="400px" loop={false} autoplay>
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
      />
    </Carousel>
  );
};
```
### 拖拽切换
通过 `draggable={true}`来开启拖拽切换轮播图
```tsx
import { Carousel } from 'leaf-ui';
import React from 'react';

export default () => {
  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    margin: '0',
  };
  return (
    <Carousel width="400px" draggable={true}>
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
      />
      <img
        style={contentStyle}
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
      />
    </Carousel>
  );
};
```
## Carousel Api
<API src="./Carousel.tsx" hideTitle>
