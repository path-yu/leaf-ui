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
  };
  return (
    <Carousel  dotPosition="bottom" width="400px" defaultIndex={0} onChange={(index,oldIndex) => {
        console.log(index,oldIndex)
    }}>
      <img
        style={contentStyle}
        date-index={0}
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
