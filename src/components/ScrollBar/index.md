### ScrollBar 滚动条

```tsx
import React from 'react';
import {ScrollBar} from 'leaf-ui';
export default () => {
    return  <ScrollBar style={{maxHeight:"120px"}}>
      我们在田野上面找猪<br/>
      想象中已找到了三只<br/>
      小鸟在白云上面追逐<br/>
      它们在树底下跳舞<br/>
      啦啦啦啦啦啦啦啦咧<br/>
      啦啦啦啦咧<br/>
      我们在想象中度过了许多年<br/>
      想象中我们是如此的疯狂<br/>
      我们在城市里面找猪<br/>
      想象中已找到了几百万只<br/>
      小鸟在公园里面唱歌<br/>
      它们独自在想象里跳舞  <br/>
      啦啦啦啦啦啦啦啦咧  <br/>
      啦啦啦啦咧  <br/>
      我们在想象中度过了许多年  <br/>
      许多年之后我们又开始想象 <br/>
    </ScrollBar>
}
```
### 水平滚动
```tsx
import React from 'react';
import {ScrollBar} from 'leaf-ui';
export default () => {
  return  <ScrollBar  horizontal >
  <div style={{whiteSpace:'nowrap',padding:'10px'}}>
    我们在田野上面找猪 想象中已找到了三只 小鸟在白云上面追逐 它们在树底下跳舞
    啦啦啦啦啦啦啦啦咧 啦啦啦啦咧 我们在想象中度过了许多年
    想象中我们是如此的疯狂 我们在城市里面找猪 想象中已找到了几百万只
    小鸟在公园里面唱歌 它们独自在想象里跳舞 啦啦啦啦啦啦啦啦咧 啦啦啦啦咧
    我们在想象中度过了许多年 许多年之后我们又开始想象 啦啦啦啦啦啦啦啦咧
  </div>
  </ScrollBar>
}
```
### 触发方式
`trigger="none"` 会让滚动条一直显示，`trigger="hover"` 会让滚动条在鼠标悬浮的时候显示。
```tsx
import React from 'react';
import {ScrollBar} from 'leaf-ui';
export default () => {
    return  <ScrollBar style={{maxHeight:"120px"}} trigger="none">
      我们在田野上面找猪<br/>
      想象中已找到了三只<br/>
      小鸟在白云上面追逐<br/>
      它们在树底下跳舞<br/>
      啦啦啦啦啦啦啦啦咧<br/>
      啦啦啦啦咧<br/>
      我们在想象中度过了许多年<br/>
      想象中我们是如此的疯狂<br/>
      我们在城市里面找猪<br/>
      想象中已找到了几百万只<br/>
      小鸟在公园里面唱歌<br/>
      它们独自在想象里跳舞  <br/>
      啦啦啦啦啦啦啦啦咧  <br/>
      啦啦啦啦咧  <br/>
      我们在想象中度过了许多年  <br/>
      许多年之后我们又开始想象 <br/>
    </ScrollBar>
}
```
<API src="ScrollBar.tsx">
